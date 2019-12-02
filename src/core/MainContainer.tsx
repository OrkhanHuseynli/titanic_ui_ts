import React from 'react';
import {Component} from "react";
import {Button, createStyles, Grid, makeStyles, Theme, Typography} from "@material-ui/core";
import {DropZone} from "./file_upload/DropZone";
import DataTable from "./table/DataTable";
import {LineChart} from "./d3charts/d3charts";
import {FileData} from "./CoreTypes";
import RestClient from "./utils/RestClient";
import { AxiosResponse } from 'axios';

const width = 500, height = 350;

type MainContainerState = {
    uploadStatus: boolean
    fileData: FileData
    regressionStatus: boolean
    rocPointList: RocPointList,
    confMatrixObjList: ConfusionMatrixObjectList
    thresholdList: number[]
}
export type RocPoint = { a: number, b: number}
export type RocPointList =  Array<RocPoint>
type RocList =  Array<[number, number]>
export type ConfusionMatrix = {
    TP: number
    TN: number
    FP: number
    FN: number
}
export type ConfusionMatrixObjectList = Array<ConfusionMatrix>

type ConfusionMatrixList = Array<[[number, number], [number, number]]>
type RocData = {
    rocList: RocList
    confMatrixList: ConfusionMatrixList,
    thresholdList: number[]
}

const createData = (name: string, value: string) => {
    return {name, value};
};

const transformToRocPointList = (rocList: RocList): RocPointList => {
    console.log("transformToRocPointList");
    let rocPointList : RocPointList = [];
    rocList.forEach(rocPointArray=> {
        rocPointList.push({a: rocPointArray[0], b: rocPointArray[1]});
    });
    return rocPointList;
};

const transformToConfusionMatrixObjectList = (confList: ConfusionMatrixList): ConfusionMatrixObjectList => {
    console.log("transformToConfusionMatrixObjectList");
    let confMatrixObjectList: ConfusionMatrixObjectList  = [];
    confList.forEach( arr => {
        let tp = arr[0][0];
        let fp = arr[0][1];
        let tn = arr[1][0];
        let fn = arr[1][1];
        let confMatrix: ConfusionMatrix = {TP: tp, FP: fp, TN: tn, FN: fn};
        confMatrixObjectList.push(confMatrix);
    });
    return confMatrixObjectList;
};

export default class MainContainer extends Component<{ classes: any }, MainContainerState> {
    constructor(props: any) {
        super(props);
        this.state = {
            uploadStatus: false,
            regressionStatus: false,
            fileData: {fileName: "", dataSize: "", inputParamsCount: "", outputParamsCount: ""},
            rocPointList: [],
            confMatrixObjList: [],
            thresholdList: []
        };
        this.getUploadStatus = this.getUploadStatus.bind(this);
        this.displayDataPreviewSection = this.displayDataPreviewSection.bind(this);
        this.displayTrainModelSection = this.displayTrainModelSection.bind(this);
        this.displayRocCurve = this.displayRocCurve.bind(this);
        this.onStartClick = this.onStartClick.bind(this);
    }


    getUploadStatus = (status: boolean, data: FileData): void => {
        console.debug("Upload status: " + this.state.uploadStatus)
        this.setState({uploadStatus: status, fileData: {...data}})
        if (!status) {
            this.setState({regressionStatus: status});
        }
    };

    displayDataPreviewSection = (): JSX.Element => {
        if (this.state.uploadStatus) {
           let  tableRows = [
                createData('File name', this.state.fileData.fileName),
                createData('Data size',  this.state.fileData.dataSize),
            ];

            return <DataTable dataRows={tableRows}/>
        }
        return <div className={this.props.classes.dataPreview}><Typography color={"textSecondary"}>No data
            provided</Typography></div>
    };


    displayTrainModelSection = (): JSX.Element => {
        return (
            <div>
                <Button variant="contained" color="primary" className={this.props.classes.button}
                            disabled={!this.state.uploadStatus} onClick={this.onStartClick}>Start</Button>
            </div>)
    };

    onStartClick = (): void => {
        console.log("START TRAINING");
        this.queryRocData();
    };


    displayRocCurve = (): JSX.Element => {
        if (this.state.regressionStatus) {

            return (<div className={this.props.classes.paper}>
                <LineChart rocPointList={this.state.rocPointList} confMatrixObjList={this.state.confMatrixObjList} thresholdList={this.state.thresholdList} width={width} height={height}/>
            </div>);
        }
        return (
            <Grid item xs={4}>
                <div className={this.props.classes.dataPreview}>
                    <Typography color={"textSecondary"}>No data provided</Typography>
                </div>
            </Grid>);
    };

    async queryRocData(){
        let rocData: RocData = {rocList: [], confMatrixList: [], thresholdList: []};
        let promoise: Promise<AxiosResponse<RocData>> = RestClient.post(`http://localhost:8888${RestClient.ENDPOINT_TRAIN}`, {},
            {headers: {'Content-Type': 'application/json'}, params: {filename: this.state.fileData.fileName}});
        await promoise.then((res: AxiosResponse<RocData>) => {
            console.info("ROC: getting roc points");
            rocData.rocList = res.data.rocList;
            rocData.confMatrixList = res.data.confMatrixList;
            rocData.thresholdList = res.data.thresholdList
        });
        let rocPointList: RocPointList = transformToRocPointList(rocData.rocList);
        let confMatrixObjList: ConfusionMatrixObjectList = transformToConfusionMatrixObjectList(rocData.confMatrixList);
        this.setState({regressionStatus: rocData.rocList.length > 0, rocPointList: rocPointList, confMatrixObjList: confMatrixObjList, thresholdList: rocData.thresholdList})
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
                        <div className={this.props.classes.paper}><DropZone getUploadStatus={this.getUploadStatus}/>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 2. Data preview</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} container direction="row" justify="center" alignItems="center">
                        <Grid item xs={4}>
                            {this.displayDataPreviewSection()}
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
                        {this.displayTrainModelSection()}
                    </Grid>
                    <Grid item xs={12} spacing={3} container
                          direction="row"
                          justify="center"
                          alignItems="center">
                        <div className={this.props.classes.paper}>
                            <Typography variant="h5"> 4. ROC curve </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} container direction="row"
                          justify="center" alignItems="center">
                        {this.displayRocCurve()}
                    </Grid>
                </Grid>
            </div>);
    }
}