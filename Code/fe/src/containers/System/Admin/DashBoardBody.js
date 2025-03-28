import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import "./AdminPage.scss";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./General.scss";
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
class DashBoardBody extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            
        }
    }
    
    async componentDidMount() {
        
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
          
    }

    render() {     
    const usersChartData = {
        labels: ["Admin", "User"],
        datasets: [
            {
                label: "Users",
                data: [300, 300],
                backgroundColor: ["#007bff","#ffc107"],
            },
        ],
    };

    const productsChartData = {
        labels: ["Vegetables", "Fruits", "Produce"],
        datasets: [
            {
                label: "Vocabularies",
                data: [120, 90, 60],
                backgroundColor: ["#28a745", "#007bff", "#ffc107"],
                innerHeight: 100,
                outerHeight:100
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
        },
    };

    return (
        <Fragment> 
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard Analysis Data</li>
                    </ol>
                    <div className='main-container'>
                       <div className="row card-container">
                            <div className='col-12 mx-3'><h2>DATA</h2></div>
                            <div className="col-5 mx-3 users-data card">
                                <h3 className="card-title">Users Data</h3>
                                <p className="card-content">Total Users: 1200</p>
                            </div>
                            <div className="col-5 mx-3 products-data card">
                                <h3 className="card-title">Vocabularies Data</h3>
                                <p className="card-content">Total Vocabularies: 450</p>
                            </div>
                            <div className='col-12 mx-3 mt-3'><h2>CHART</h2></div>
                            <div className="col-5 mx-3 users-chart chart">
                                <h4 className="chart-title">Users Overview</h4>
                                <Pie data={usersChartData} options={chartOptions} />
                            </div>
                            <div className="col-5 mx-3 products-chart chart">
                                <h4 className="chart-title">Vocabularies Overview</h4>
                                <Bar data={productsChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>   
        </Fragment>
    );
    }

}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
        language : state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardBody);
