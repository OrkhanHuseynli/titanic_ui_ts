import React from 'react';
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import {Typography, Button, Grid, Box} from "@material-ui/core";
import {LineChart} from "./core/d3charts/d3charts";
import {DropZone} from "./core/file_upload/DropZone";
import DataTable from "./core/table/DataTable";
import 'typeface-roboto';
import logo from './logo.svg';
import './App.css';
import MainContainer from "./core/MainContainer";

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
            <MainContainer classes={classes} />
        </div>
    );
}

export default App;
