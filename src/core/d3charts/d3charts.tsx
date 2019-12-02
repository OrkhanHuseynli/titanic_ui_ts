import * as React from "react";
import * as d3 from 'd3'
import {Component} from "react";
import './d3charts.css';
import {ConfusionMatrix, ConfusionMatrixObjectList, RocPoint, RocPointList} from "../MainContainer";

type CurveProps = {
    width: any
    height: any
    rocPointList: RocPointList
    confMatrixObjList: ConfusionMatrixObjectList
    thresholdList: number[]
}
type CurveState = {
    tooltip: Tooltip
}

type Tooltip = {
    x: number
    y: number
    display: string
    width: number
    threshold: number
    confusionMatrix: ConfusionMatrix
}

type CircleData = { cx: number, cy: number, threshold: number, confusionMatrix: ConfusionMatrix }

const getCircleData = (rocPoint: RocPoint, threshold: number, confusionMatrix: ConfusionMatrix): CircleData => {
    return {cx: rocPoint.b, cy: rocPoint.a, threshold:threshold, confusionMatrix: confusionMatrix}
};

const getCircleDataList = (rocPointList: RocPointList, thresholdList: number[], confusionMatrixObjList: ConfusionMatrixObjectList): Array<CircleData> => {
    console.info("getCircleDataList");
    if (rocPointList.length !== confusionMatrixObjList.length) {
        let msg = "Length of RocPointList and ConfusionMatrixObjectList objects must be equal!";
        console.error(msg);
        throw Error(msg);
    }

    let circleDataList: Array<CircleData> = [];
    for (let i = 0; i < rocPointList.length; i++) {
        circleDataList.push(getCircleData(rocPointList[i], thresholdList[i], confusionMatrixObjList[i]))
    }
    return circleDataList;
};

export class LineChart extends Component<CurveProps, CurveState> {

    constructor(props: CurveProps) {
        super(props);
        this.state = {
            tooltip: {x: 0, y: 0, display: "none", width: 35, threshold: 0, confusionMatrix: {TP: 0, TN: 0, FP: 0, FN: 0}}
        }
    }

    onMouseOverEv = (e: any, x: number, y: number, threshold: number, confusionMatrix: ConfusionMatrix) => {
        let tooltip: Tooltip = {
            x: x,
            y: y,
            display: "true",
            width: 35,
            threshold: threshold,
            confusionMatrix: {TP: confusionMatrix.TP, TN: confusionMatrix.TN, FP: confusionMatrix.FP, FN: confusionMatrix.FN}
        };
        this.setState({tooltip: {...tooltip}})
    };

    onMouseOutEv = (e: any) => {
        let tooltip: Tooltip = {x: 0, y: 0, display: "none", width: 35, threshold: 0, confusionMatrix: {TP: 0, TN: 0, FP: 0, FN: 0}};
        this.setState({tooltip: {...tooltip}})
    };

    render() {

        const margin = 20;
        const {width, height, rocPointList, confMatrixObjList, thresholdList} = this.props;

        const h = height - 2 * margin, w = width - 2 * margin;

        //number formatter
        const xFormat = d3.format('.2');

        //x scale
        const x = d3.scaleLinear()
        // @ts-ignore
            .domain(d3.extent(rocPointList, d => d.b)) //domain: [min,max] of a
            .range([margin, w]);

        //y scale

        const y = d3.scaleLinear()
        // @ts-ignore
            .domain([0, d3.max(rocPointList, d => d.a)]) // domain [0,max] of b (start from 0)
            .range([h, margin]);

        //line generator: each point is [x(d.a), y(d.b)] where d is a row in data
        // and x, y are scales (e.g. x(10) returns pixel value of 10 scaled by x)
        const line = d3.line()
        // @ts-ignore
            .x(d => x(d.b))
            // @ts-ignore
            .y(d => y(d.a))
            .curve(d3.curveCatmullRom.alpha(0.5)); //curve line

        // @ts-ignore
        const xTicks = x.ticks(6).map(d => (
            x(d) > margin && x(d) < w ?
                <g transform={`translate(${x(d)},${h + margin})`}>
                    <text>{xFormat(d)}</text>
                    <line x1='0' y1='0' y2='5' transform="translate(0,-20)"/>
                </g>
                : null
        ));


        const yTicks = y.ticks(5).map(
            // @ts-ignore
            d => (
                y(d) > 10 && y(d) < h ?
                    <g transform={`translate(${margin},${y(d)})`}>
                        <text x="-12" y="5">{xFormat(d)}</text>
                        <line x1='0' y1='0' y2='0' transform="translate(-5,0)"/>
                        <line className='gridline' x1={w - margin} y1='0' y2='0' transform="translate(-5,0)"/>
                    </g>
                    : null
            ));

        let circlesData: Array<CircleData> = getCircleDataList(rocPointList, thresholdList, confMatrixObjList);

        let circlesSVG = <g>
            {
                circlesData.map((d: CircleData) => {
                    // @ts-ignore
                    return <g>
                        <circle className={"circle"} key={d.cx} cx={x(d.cx)} cy={y(d.cy)} r={6} onMouseOver={(e: any) => {
                            this.onMouseOverEv(e, d.cx, d.cy, d.threshold, d.confusionMatrix)
                        }} onMouseOut={this.onMouseOutEv}/>
                    </g>
                })
            }
        </g>;

        let tulAxisDistX = 0.08;
        let tulTextDistX = 0.02;
        let tulAxisDistY = 0.085;
        let tulTextDistY = 0.05;
        let thresholdDistY = 0.07;


        let tooltipSVG = <g>
            <rect className={"tooltip-thresh"} x={x(this.state.tooltip.x)} y={y(this.state.tooltip.y + thresholdDistY)}
                  display={this.state.tooltip.display} width={this.state.tooltip.width*2} height="25"/>
            <text className={"tooltip-text"} x={x(this.state.tooltip.x + tulTextDistX-0.01)}
                  y={y(this.state.tooltip.y + thresholdDistY - tulTextDistY)}
                  display={this.state.tooltip.display}>thrld : {this.state.tooltip.threshold}
            </text>
            <rect className={"tooltip-blue"} x={x(this.state.tooltip.x)} y={y(this.state.tooltip.y)}
                  display={this.state.tooltip.display} width={this.state.tooltip.width} height="25"/>
            <text className={"tooltip-text"} x={x(this.state.tooltip.x + tulTextDistX)}
                  y={y(this.state.tooltip.y - tulTextDistY)}
                  display={this.state.tooltip.display}>{this.state.tooltip.confusionMatrix.TP}
            </text>
            <rect className={"tooltip-red"} x={x(this.state.tooltip.x + tulAxisDistX)} y={y(this.state.tooltip.y)}
                  display={this.state.tooltip.display} width={this.state.tooltip.width} height="25"/>
            <text className={"tooltip-text"} fontFamily={"Verdana"} fontSize={"12"} fill={"black"}
                  x={x(this.state.tooltip.x + tulAxisDistX + tulTextDistX)}
                  y={y(this.state.tooltip.y - tulTextDistY)}
                  display={this.state.tooltip.display}>{this.state.tooltip.confusionMatrix.TN}
            </text>
            <rect className={"tooltip-red"} x={x(this.state.tooltip.x)} y={y(this.state.tooltip.y - tulAxisDistY)}
                  display={this.state.tooltip.display} width={this.state.tooltip.width} height="25"/>
            <text  className={"tooltip-text"} fontFamily={"Verdana"} fontSize={"12"} fill={"black"} x={x(this.state.tooltip.x + tulTextDistX)}
                  y={y(this.state.tooltip.y - tulAxisDistY - tulTextDistY)}
                  display={this.state.tooltip.display}>{this.state.tooltip.confusionMatrix.FN}
            </text>
            <rect className={"tooltip-blue"} x={x(this.state.tooltip.x + tulAxisDistX)}
                  y={y(this.state.tooltip.y - tulAxisDistY)}
                  display={this.state.tooltip.display} width={this.state.tooltip.width} height="25"/>
            <text className={"tooltip-text"} fontFamily={"Verdana"} fontSize={"12"} fill={"black"}
                  x={x(this.state.tooltip.x + tulAxisDistX + tulTextDistX)}
                  y={y(this.state.tooltip.y - tulAxisDistY - tulTextDistY)}
                  display={this.state.tooltip.display}>{this.state.tooltip.confusionMatrix.FP}
            </text>
        </g>

        return (
            <div>
                <svg width={width} height={height}>
                    <line className="axis" x1={margin} x2={w} y1={h} y2={h}/>
                    <line className="axis" x1={margin} x2={margin} y1={margin} y2={h}/>
                    // @ts-ignore
                    <path className={"curve-line"} d={line(rocPointList)}/>
                    // @ts-ignore
                    <path className={"border-line"} d={line([{a: 0, b: 0}, {a: 1, b: 1}])}/>
                    <g className="axis-labels">
                        {xTicks}
                    </g>
                    <g className="axis-labels">
                        {yTicks}
                    </g>
                    {circlesSVG}
                    {tooltipSVG}
                </svg>
            </div>
        )
    }
}