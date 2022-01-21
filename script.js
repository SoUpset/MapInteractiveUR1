const btn = document.getElementById('btn')
const nav = document.getElementById('nav')
const btn2D = document.getElementById('2D')
const btn3D = document.getElementById('3D')
const container = document.getElementById('container')
const darkMode = document.getElementById('toggle')

btn2D.addEventListener("click", () => {
    createNotification("2D")
});

btn3D.addEventListener("click", () => {
    createNotification("3D")
});

toggle.addEventListener("change", (event)=> {
    document.body.classList.toggle('dark', event.target.checked);
})

function createNotification(dimension) {
    const notif = document.createElement('div');
    notif.classList.add('toast');

    container.appendChild(notif);

    notif.innerText = "Vous êtes passé en " + dimension;

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

btn.addEventListener("click", () => {
    nav.classList.toggle('active');
    btn.classList.toggle('active');
});

function removeAllMarkers(list) {
    for (var i = currentMarkers.length-1;i>=0;i--) {
        list[i].remove()
    }
}
