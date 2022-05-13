const fs = require('fs')
const putanja = '../oglasi.json'

let oglasi = procitaj()
exports.lista = oglasi

function procitaj(){
    let oglasi = fs.readFileSync(putanja, (err, data) => {
        if(err) throw err
        return data
    })  
    return JSON.parse(oglasi)
}

function snimi(data){
    fs.writeFileSync(putanja,JSON.stringify(data, null, 4))
}

exports.vratiId = (id) => {
    return this.lista.find(o => o.id == id)
}

exports.brisanje = (id) => {
    this.lista = this.lista.filter(o => o.id != id )
}

exports.dodavanje = (nov)=>{
    let id=0
    if(this.lista.length>0){
        id=this.lista[this.lista.length-1].id+1
    }
    nov.id=id
    this.lista.push(nov)
    snimi(this.lista)
}

exports.izmena = (oglasi) => {
    this.lista[this.lista.findIndex(o => o.id == oglasi.id)] = oglasi
}

exports.filtriranje = (kategorija) => {
    return this.lista.filter(f=>f.Kategorija==kategorija)}
