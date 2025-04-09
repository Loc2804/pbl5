import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import "./AdminPage.scss";
import * as actions from "../../../store/actions";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import "./General.scss";
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

class DashBoardBody extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            listUser: [],
            listVoc: [],
            countUser: 0,
            countVoc: 0,
        }
    }
    
    async componentDidMount() {
        this.props.getAllUser();
        this.props.getAllVoc();
    }
    
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.listUser !== prevProps.listUser) {
            this.setState({
                listUser: this.props.listUser,
                countUser: this.props.listUser.length
            });
        }
        if (this.props.listVoc !== prevProps.listVoc) {
            this.setState({
                listVoc: this.props.listVoc,
                countVoc: this.props.listVoc.length
            });
        }
    }    

    render() {
        const { listUser, listVoc, countUser, countVoc } = this.state;
        
        // Đếm user theo loại (Admin / User)
        const adminUsers = listUser.filter(user => user.role.role_value === 'ADMIN').length;
        const normalUsers = listUser.filter(user => user.role.role_value === 'USER').length;
    
        // Đếm vocab theo category (Vegetables / Fruits / Roots)
        const categoryCounts = { vegetable: 0, fruit: 0, root: 0 };
        listVoc.forEach(voc => {
            if (voc.category && voc.category.category_value) {
                const category = voc.category.category_value;
                if (categoryCounts[category] !== undefined) {
                    categoryCounts[category]++;
                }
            }
        });
    
        const usersChartData = {
            labels: ["Admin", "User"],
            datasets: [{
                label: "Users",
                data: [adminUsers, normalUsers],
                backgroundColor: ["#007bff", "#ffc107"],
            }],
        };
    
        const productsChartData = {
            labels: ["Vegetables", "Fruits", "Roots"],
            datasets: [{
                label: "Vocabularies",
                data: [
                    categoryCounts.vegetable,
                    categoryCounts.fruit,
                    categoryCounts.root
                ],
                backgroundColor: ["#28a745", "#007bff", "#ffc107"],
            }],
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
                                    <p className="card-content">Total Users: {countUser}</p>
                                </div>
                                <div className="col-5 mx-3 products-data card">
                                    <h3 className="card-title">Vocabularies Data</h3>
                                    <p className="card-content">Total Vocabularies: {countVoc}</p>
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
        listUser : state.admin.listUser,
        listVoc : state.admin.listVoc,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUser : () => dispatch(actions.getAllUserStart()),
        getAllVoc : () => dispatch(actions.getAllVocStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoardBody);
