
document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const classInfoEl = document.getElementById('classInfo');
    const weaponInfoEl = document.getElementById('weaponInfo');
    const skillInfoEl = document.getElementById('skillInfo');
    const defenseInfoEl = document.getElementById('defenseInfo');

    let buildData = null;

    async function loadData() {
        try {
            const response = await fetch('randomizer.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            buildData = await response.json();
            generateBtn.disabled = false;
        } catch (error) {
            console.error("Failed to load build data:", error);
        }
    }

    function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function isWeaponCompatibleWithClass(selectedClass, weaponName) {
        const weaponAttributes = buildData.weapons[weaponName].attributes;
        const classAttributes = selectedClass.attributes;
        return(classAttributes.includes(weaponAttributes[0]));
    }

    function isWeaponCompatibleWithDefenseType(selectedClass, defenseType, selectedWeapon) {
        if (defenseType.includes("Block") && !selectedWeapon.includes("Shield")) {
            return false;
        }
        const defenseTypeAttributes = buildData.defenseTypes[defenseType].attributes;
        const classAttributes = selectedClass.attributes;
        return(classAttributes.includes(defenseTypeAttributes[0]));
    }

    function generateBuild() {
        const selectedClass = getRandomElement(buildData.classes);
        const selectedAscendancy = getRandomElement(selectedClass.ascendancies);
        const compatibleWeapons = Object.keys(buildData.weapons).filter(weaponName => 
            isWeaponCompatibleWithClass(selectedClass, weaponName)
        );
        const selectedWeapon = getRandomElement(compatibleWeapons);
        const compatibleDefenseTypes = Object.keys(buildData.defenseTypes).filter(defenseType => 
            isWeaponCompatibleWithDefenseType(selectedClass, defenseType, selectedWeapon)
        );
        const selectedDefenseType = getRandomElement(compatibleDefenseTypes);
        const compatibleCategories = buildData.weaponCompatibility[selectedWeapon];
        const compatibleSkills = [];
        compatibleCategories.forEach(category => {
            if (buildData.skills[category]) {
                compatibleSkills.push(...buildData.skills[category]);
            }
        });
        if (selectedAscendancy === "Warbringer" && buildData.skills.warbringer) {
            compatibleSkills.push(...buildData.skills.warbringer);
        }
        if (selectedAscendancy === "Pathfinder" && buildData.skills.pathfinder) {
            compatibleSkills.push(...buildData.skills.pathfinder);
        }
        if (selectedAscendancy === "Smith of Kitava" && buildData.skills.smith_of_kitava) {
            compatibleSkills.push(...buildData.skills.smith_of_kitava);
        }
        const uniqueSkills = [...new Set(compatibleSkills)];
        const numSkills = Math.random() < 0.50 ? 2 : 1;
        const selectedSkills = [];
        const skillsCopy = [...uniqueSkills];
        for (let i = 0; i < numSkills && skillsCopy.length > 0; i++) {
            const skill = getRandomElement(skillsCopy);
            selectedSkills.push(skill);
            skillsCopy.splice(skillsCopy.indexOf(skill), 1);
        }
        
        classInfoEl.innerHTML = `<span class="highlight">${selectedClass.name}</span> → <span class="highlight">${selectedAscendancy}</span>`;
        weaponInfoEl.innerHTML = `<span class="highlight">${selectedWeapon}</span>`;
        skillInfoEl.innerHTML = selectedSkills.map(skill => `<span class="highlight">${skill}</span>`).join(numSkills > 1 ? ' + ' : '');
        defenseInfoEl.innerHTML = `<span class="highlight">${selectedDefenseType}</span>`;
    }

    generateBtn.addEventListener('click', generateBuild);

    loadData();
});
