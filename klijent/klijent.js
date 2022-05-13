const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogled=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(procitajPogled("index"));
});

app.get("/oglasi",(req,res)=>{
    axios.get('http://localhost:3000/svioglasi').then(response=>{
        let prikaz="";
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datumIsteka}</td>
            <td>${element.cena.valuta}</td>
            <td>${element.cena.cena}</td>
            <td>${element.tekst}</td>
            <td>${element.oznaka[0]}</td>
            <td>${element.email[0].adresa}</td>
            <td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        })
        res.send(procitajPogled('oglasi').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
})

app.post("/filtriraj",(req,res)=>{
    axios.get(`http://localhost:3000/filtrirajPoKategoriji?kat=${req.body.filter}`).then(response=>{
        let prikaz=""
        response.data.forEach(element=>{
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datumIsteka}</td>
            <td>${element.cena.valuta}</td>
            <td>${element.cena.cena}</td>
            <td>${element.tekst}</td>
            <td>${element.oznaka[0]}</td>
            <td>${element.email[0].adresa}</td>
            <td><a href="/izmeni/${element.id}">Izmeni</a></td>
            <td><a href="/obrisi/${element.id}">Obrisi</a></td>
            </tr>`
        })
        res.send(procitajPogled('oglasi').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
})

app.get("/obrisi/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/obrisioglas/${req.params["id"]}`)
    res.redirect("/oglasi");
});

app.get("/dodajoglas",(req,res)=>{
    res.send(procitajPogled("dodajoglas"));
});

app.post("/snimioglas",(req,res)=>{
    axios.post("http://localhost:3000/dodajoglas",{
        id:0,
        kategorija:req.body.kat,
        datumIsteka:req.body.vreme,
        cena:{
            valuta:req.body.valuta,
            cena:req.body.cena
        },
        tekst:req.body.text,
        oznaka:[req.body.Oznaka],
        email:[{
            tip:req.body.tipemail,
            adresa:req.body.email
        }]
    })
    res.redirect("/oglasi");
})



app.get("/izmeni/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`).then(response=>{
      
            let prikaz=`<label>Izaberite Kategoriju Proizvoda</label>
            <input type="number" name="id" value=${response.data.id} hidden>
            <br>
            <select name="kat">
                <option value="${response.data.kategorija}">${response.data.kategorija}</option>
                <option value="automobili">automobili</option>
                <option value="alati">alati</option>
                <option value="trotineti">trotineti</option>
                <option value="kursevi">kursevi</option>
            </select>
            <br>
            <br>
            <label for="">Unesite Datum Isteka Oglasa</label>
            <br>
            <input type="date" name="vreme" value=${response.data.datumIsteka}>
            <br>
            <br>
            <label for="">Unesite Cenu</label>
            <br>
            <input type="number" name="cena" value=${response.data.cena.cena}>
            <select name="valuta">
                <option value="${response.data.cena.valuta}">${response.data.cena.valuta}</option>
                <option value="RSD">RSD</option>
                <option value="EUR">EUR</option>
                <option value="CHF">CHF</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
            </select>
            <br>
            <br>
            <label for="">Unesite Tekst Oglasa</label>
            <br>
            <input type="text" name="text" value=${response.data.tekst}>
            <br>
            <br>
            <label for="">Unesite Oznake</label>
            <br>
            <input type="text" name="Oznaka" value=${response.data.oznaka[0]}>
            <br>
            <label for="">Unesite Vasu Email Adresu</label>
            <br>
            <input type="text" name="email" value=${response.data.email[0].adresa}>
            <select name="tipemail" value = ${response.data.email[0].tip}>
                <option value="privatni">Privatni</option>
                <option value="sluzbeni">Sluzbeni</option>
            </select>`
        res.send(procitajPogled('izmena').replace("#{data}",prikaz))
    })
    .catch(error=>{
        console.log(error)
    })
});

app.post("/izmeniOglas",(req,res)=>{
    axios.post("http://localhost:3000/izmeniOglas",{
        id:parseInt(req.body.id),
        kategorija:req.body.kat,
        datumIsteka:req.body.vreme,
        cena:{
            valuta:req.body.valuta,
            cena:req.body.cena
        },
        tekst:req.body.text,
        oznaka:[req.body.Oznaka],
        email:[{
            tip:req.body.tipemail,
            adresa:req.body.email
        }]
    })
    res.redirect("/oglasi");
})

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});