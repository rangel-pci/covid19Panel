import React, { Component } from 'react';
import axios from 'axios';
import './style.css';


export default class Brasil extends Component{
  constructor(props){
    super(props)
    this.state = {
      cases: null,
      casesToday: null,
      incidence: null,

      recovered: null,
      followUp: null,

      deaths: null,
      deathsToday: null,
      mortality: null,

      date: null,
      time: null,

      waiting: 'waiting',
    }
  }

  componentDidMount(){
    this.getData();
  }

  //get data from API
  getData(){
    const method = 'GET';
    const url = 'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeralApi';
    const headers = { authority: 'xx9p7hp1p7.execute-api.us-east-1.amazonaws.com' }

    axios({
      method,
      url,
      headers
    })
    .then((res) => {

      this.setData(res.data);
    })
    .catch((error) => {

      console.log(error);
    });
  }  

  formatDate(dateTime){
    //convert date from yyyymmddThhmmss to data(dd/mm/yy) and time(hh/mm/ss)

    const dt = new Date(dateTime);

    const day = dt.getDate() < 10? '0'+dt.getDate(): dt.getDate();
    const month = (dt.getMonth()+1) < 10? '0'+(dt.getMonth()+1): (dt.getMonth()+1);
    const year = dt.getFullYear();
    const hour = dt.getHours();
    const min = dt.getMinutes();
    const sec = dt.getSeconds();

    const date = `${day}/${month}/${year}`;
    const time = `${hour}:${min}:${sec}`;

    return {date, time}
  }

  //fill the app
  setData(data){
    const { confirmados, obitos, dt_updated } = data;

    const {date, time } = this.formatDate(dt_updated);

    this.setState({
      cases: Number(confirmados.total).toLocaleString(),
      casesToday: Number(confirmados.novos).toLocaleString(),
      incidence: confirmados.incidencia,

      recovered: Number(confirmados.recuperados).toLocaleString(),
      followUp: Number(confirmados.acompanhamento).toLocaleString(),

      deaths: Number(obitos.total).toLocaleString(),
      deathsToday: Number(obitos.novos).toLocaleString(),
      mortality: obitos.mortalidade,

      date,
      time,
      waiting: null
    });
  }

  render(){

    const {
      cases, casesToday, incidence, recovered, followUp,
      deaths, deathsToday, mortality, date, time, waiting
    } = this.state;

    const { __function } = this.props;

    return (
      <div className="App">
        <div className="App-container">

          <header className={waiting}>
            <div>
              <h1>Painel Covid - 19</h1>
              <p>Coronavírus no Brasil</p>
            </div>

            <div className="select">
              <button>Ver Estados</button>
            </div>
          </header>

          <main className={'cards '+waiting}>
            
            <div className="card-container">
              <div className="card">
                <img src="./assets/case.svg" alt="Casos" />
                <div className="info">
                  <p>{ cases }</p>
                  <h2>Casos</h2>
                </div>
              </div>
              <div className="mini-card">
                <div className="info">
                  <p>{ casesToday }</p>
                  <h2>Hoje</h2>
                </div>
                <div className="info">
                  <p>{ incidence }</p>
                  <h2>Incidência</h2>
                </div>
              </div>
            </div>

            <div className="card-container">
              <div className="card">
                <img src="./assets/death.svg" alt="Mortos" />
                <div className="info">
                  <p>{ deaths }</p>
                  <h2>Mortos</h2>
                </div>
              </div>
              <div className="mini-card">
                <div className="info">
                  <p>{ deathsToday }</p>
                  <h2>Hoje</h2>
                </div>
                <div className="info">
                  <p>{ mortality }</p>
                  <h2>Mortalidade</h2>
                </div>
              </div>
            </div>

            <div className="card-container">
              <div className="card">
                <img src="./assets/recovery.svg" alt="Recuperados" />
                <div className="info">
                  <p>{ recovered }</p>
                  <h2>Recuperados</h2>
                </div>
              </div>
              <div className="mini-card">
                <div className="info">
                  <p>{ followUp }</p>
                  <h2>Em<br />Acompanhamento</h2>
                </div>
                <div className="info">
                  <p><br /></p>
                  <h2><br /></h2>
                </div>
              </div>
            </div>

            <div className="card-container">
              <div className="card">
                <img src="./assets/clock.svg" alt="Tempo" />
                <div className="info">
                  <h2>Última atualização em</h2>
                  <p>{ date }</p>
                  <h2>Às {time}</h2>
                </div>
              </div>
              <div className="mini-card">
                <div className="info">
                  <a href="https://saude.gov.br/" title="Ministério da Saúde">MS</a>
                  <h2>Fonte</h2>
                </div>
                <div className="info">
                  <p><br /></p>
                  <h2><br /></h2>
                </div>
              </div>
            </div>

          </main>

        <footer>
          <a href="https://github.com/rangel-pci" target="_blank">
            <img alt="Git Hub" src="/assets/github.svg" width="30px" height="30px" />
            <span>Sobre</span>
          </a>
        </footer>

        </div>
      </div>
    );
  } 
}