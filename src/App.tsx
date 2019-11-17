import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {Typography, Button, Grid, Box} from "@material-ui/core";
import {LineChart} from "./core/d3charts/d3charts";
import {DropZone} from "./core/file_upload/DropZone";
import DataTable from "./core/table/DataTable";
import 'typeface-roboto';
import logo from './logo.svg';
import './App.css';

const width = 500, height = 350, margin = 20;
const mockData = [
    {a: -0.59, b: 0.49},
    {a: 0.25, b: 0.33},
    {a: 0.46, b: 0.27},
    {a: 0.64, b: 0.20},
    {a: 0.73, b: 0.17},
    {a: 0.89, b: 0.08},
    {a: 1.0, b: 0.0},
    {a: 1.0, b: 0.0}

];

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
        button: {
            margin: theme.spacing(1),
        },
        input: {
            display: 'none',
        },
    }),
);

const App: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <Typography variant="h5"> 1. Upload data </Typography>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.paper}><DropZone/></div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <Typography variant="h5"> 2. Data preview</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} container  direction="row" justify="center" alignItems="center">
                    <Grid item xs={4}>
                        <DataTable/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <Typography variant="h5"> 3. Train model</Typography>
                    </div>
                </Grid>
                <Grid item xs={12} spacing={3} container
                      direction="row"
                      justify="center"
                      alignItems="center">
                    <Button variant="contained" color="primary" className={classes.button}>
                        Start
                    </Button>
                </Grid>
                <Grid item xs={12} spacing={3} container
                      direction="row"
                      justify="center"
                      alignItems="center">
                    <div className={classes.paper}>
                        <Typography variant="h5"> 4. ROC curve </Typography>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div className={classes.paper}>
                        <LineChart data={mockData} width={width} height={height}/>
                    </div>
                </Grid>
            </Grid>
            {/*<BarChart data={[49,94, 39]} width={200} height={100}/>*/}
            {/*<header className="App-header">*/}
            {/*  <img src={logo} className="App-logo" alt="logo" />*/}
            {/*  <p>*/}
            {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
            {/*  </p>*/}
            {/*  <a*/}
            {/*    className="App-link"*/}
            {/*    href="https://reactjs.org"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*  >*/}
            {/*    Learn React*/}
            {/*  </a>*/}
            {/*</header>*/}
        </div>
    );
}

export default App;
