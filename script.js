document.addEventListener('DOMContentLoaded', () => {
    let data;

    fetch('randomizer.json')
        .then(response => response.json())
        .then(jsonData => {
            data = jsonData;
            setupEventListeners();
        });

    function setupEventListeners() {
        document.getElementById('roll-all-btn').addEventListener('click', rollAll);
        document.getElementById('roll-class-btn').addEventListener('click', rollClassAndAscendancy);
        document.getElementById('roll-weapon-skills-btn').addEventListener('click', rollWeaponAndSkills);
        document.getElementById('roll-defense-btn').addEventListener('click', rollDefense);
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function rollClassAndAscendancy() {
        const randomClass = getRandomItem(data.classes);
        const randomAscendancy = getRandomItem(randomClass.ascendancies);
        document.getElementById('class-result').textContent = `Class: ${randomClass.name}`;
        document.getElementById('ascendancy-result').textContent = `Ascendancy: ${randomAscendancy}`;
    }

    function rollWeaponAndSkills() {
        const randomWeapon = getRandomItem(data.weapons);
        const numSkills = Math.floor(Math.random() * 3) + 1;
        const selectedSkills = [];
        for (let i = 0; i < numSkills; i++) {
            selectedSkills.push(getRandomItem(randomWeapon.skills));
        }
        document.getElementById('weapon-type-result').textContent = `Weapon Type: ${randomWeapon.name}`;
        document.getElementById('main-skills-result').textContent = `Main Skill(s): ${selectedSkills.join(', ')}`;
    }

    function rollDefense() {
        const randomDefense = getRandomItem(data.defense);
        document.getElementById('defense-strategy-result').textContent = `Defense Strategy: ${randomDefense.name}`;
    }

    function rollAll() {
        rollClassAndAscendancy();
        rollWeaponAndSkills();
        rollDefense();
    }
});