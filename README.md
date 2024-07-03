# Web_aplikacija

Web-aplikacija se pokrće iz terminala naredbom npm start

Direktorij build s produkcijskom verzijom web-apliakcije kreiran je pokretanjem naredbe npm run build 

Index.js upravlja rutama koristeći react-router-dom
forma.js se nalazi na path="/"
prikaz.js se nalazi na path="/prikaz"

forma.js šalje http post zahtjev na xml datoteku koja se nalazi na Lokalni_server
    try {
      const response = await fetch('http://localhost:5000/formData.xml', { //url xml datoteke na Lokalni_server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });

prikaz.js šalje http get zahtjev na xml datoteku koja se nalazi na Lokalni_server
  const fetchData = () => {
    fetch('http://localhost:5000/formData.xml') //url xml datoteke na Lokalni_server
      .then(response => response.text()) 
      .then(xmlData => {
        const jsonData = xml2js(xmlData, { compact: true }); 
        const forms = jsonData.forms?.form || []; 
        setFormData(forms); 
      })
      .catch(error => console.error('Greška pri dohvaćanju podataka:', error));
  };