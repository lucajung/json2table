const data = [
    { Name: 'John Doe', Age: 30, Country: 'USA' },
    { Name: 'Jane Smith', Age: 25, Country: 'Canada' },
    { Name: 'Michael Johnson', Age: 28, Country: 'USA' },
    { Name: 'Emily Brown', Age: 22, Country: 'Canada' },
    { Name: 'David Lee', Age: 32, Country: 'Australia' },
    { Name: 'Sophia Chen', Age: 27, Country: 'Australia' },
    { Name: 'James Kim', Age: 31, Country: 'USA' },
    { Name: 'Isabella Wang', Age: 29, Country: 'Canada' },
    { Name: 'Oliver Wong', Age: 24, Country: 'Canada' },
    { Name: 'Emma Liu', Age: 26, Country: 'Australia' }
];

const config = {
    group: ['Country'],
};

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("table-normal").appendChild(render(data, {}));
    document.getElementById("table-grouped").appendChild(render(data, config));
});