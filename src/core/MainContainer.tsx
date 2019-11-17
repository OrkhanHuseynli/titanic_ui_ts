import React from 'react';
import {Component} from "react";
import {Button, createStyles, Grid, makeStyles, Theme, Typography} from "@material-ui/core";
import {DropZone} from "./file_upload/DropZone";
import DataTable from "./table/DataTable";
import {LineChart} from "./d3charts/d3charts";
import {isBoolean} from "util";


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

type MainContainerState = {
    uploadStatus: boolean;
}

export default class MainContainer extends Component<{classes: any}, MainContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            uploadStatus: false
        };
        this.getUploadStatus = this.getUploadStatus.bind(this);
    }


    getUploadStatus = (status: boolean):void => {
        console.log("Upload status before " + this.state.uploadStatus)
        this.setState({uploadStatus: status})
        console.log("Upload status changed " + this.state.uploadStatus)
    };


    render() {
        return (
            <div className={this.props.classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 1. Upload data </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}><DropZone getUploadStatus={this.getUploadStatus}/></div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 2. Data preview</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} container  direction="row" justify="center" alignItems="center">
                        <Grid item xs={4}>
                            <DataTable/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 3. Train model</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} spacing={3} container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <Button variant="contained" color="primary" className={this.props.classes.button} disabled={!this.state.uploadStatus} >
                            Start
                        </Button>
                    </Grid>
                    <Grid item xs={12} spacing={3} container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 4. ROC curve </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}>
                            <LineChart data={mockData} width={width} height={height}/>
                        </div>
                    </Grid>
                </Grid>
            </div>);
    }
}