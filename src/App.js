import React, { Component } from 'react';
import axios from 'axios';
import './css/App.css';

export default class App extends Component{
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

      states: [],
      showStates: 'd-none'
    }
  }

  componentDidMount(){
    this.getBrazilData();
    this.getStatesData();
  }

  //get Brazil data from API
  getBrazilData = async () => {
    const method = 'GET';
    const url = 'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalGeralApi';
    const headers = { authority: 'xx9p7hp1p7.execute-api.us-east-1.amazonaws.com' }

    await axios({
      method,
      url,
      headers
    })
    .then((res) => {

      this.setBrazilData(res.data);
    })
    .catch((error) => {

      //console.log(error);
    });
  }

  //get Brazil States data from API
  getStatesData = async () => {
    const method = 'GET';
    const url = 'https://xx9p7hp1p7.execute-api.us-east-1.amazonaws.com/prod/PortalEstado';

    await axios({
      method,
      url
    })
    .then((res) => {

      this.setState({ states: res.data });
    })
    .catch((error) => {

      //console.log(error);
    });
  }

  //fill the app
  setBrazilData = (data) => {
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

  showStates = () => {
    const { showStates } = this.state;
    if (showStates === 'd-none') {
      this.setState({ showStates: 'd-display' });
    }else{
      this.setState({ showStates: 'd-none' });
    }
  }

  formatDate = (dateTime) => {
    //convert date from yyyymmddThhmmss to date(dd/mm/yy) and time(hh/mm/ss)

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

  render(){

    const {
      cases, casesToday, incidence, recovered, followUp,
      deaths, deathsToday, mortality, date, time,
      waiting, states, showStates
    } = this.state;

    return (
      <div className="App">
        <div className="App-container">

          <header className={waiting}>
            <h1>Painel Covid - 19</h1>
            <p>Coronavírus no Brasil</p>
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
                  <p style={{ color: '#FF4C61' }} >{ deaths }</p>
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
                  <p style={{ color: '#33D69F' }} >{ recovered }</p>
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

            <div className="by-state"><button onClick={this.showStates}>Ver números de cada estado do Brasil</button></div>

            {states.map( (state) => {
              return(
                <div className={'card card-state '+showStates} key={state.nome}>
                  <h3>{state.nome}</h3>
                  <div className="info">
                    <p>{Number(state.casosAcumulado).toLocaleString()}</p>
                    <p>{Number(state.obitosAcumulado).toLocaleString()}</p>

                    <h2>Casos</h2>                
                    <h2>Mortos</h2>
                  </div>
                </div>
              )
            })}

          </main>

        <footer>
          <a href="https://github.com/rangel-pci/covid19Panel" target="_blank" rel="noopener noreferrer">
            <img alt="Git Hub" src="/assets/github.svg" width="30px" height="30px" />
            <span>Sobre</span>
          </a>
        </footer>

        </div>
      </div>
    );
  } 
}