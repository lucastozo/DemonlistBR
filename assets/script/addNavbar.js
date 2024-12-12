// navbar location: assets/components/navbar.html
fetch('/DemonlistBR/assets/components/navbar.html')
    .then(response => response.text())
    .then(data => {
        let div = document.createElement('div');
        div.innerHTML = data;
        document.body.insertBefore(div, document.body.firstChild);
    });