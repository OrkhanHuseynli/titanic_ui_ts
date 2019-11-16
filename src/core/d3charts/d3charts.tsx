import * as React from "react";
import * as d3 from 'd3'
import {Component} from "react";
import { scaleLinear } from 'd3-scale';
import './d3charts.css';

type CurveProps = {
    width: any
    height: any
    data: any
}

// export function BarChart({ width, height, data }: Props) {
//     const yScale = scaleLinear()
//         .domain([0, Math.max(...data)])
//         .rangeRound([height, 0]);
//     const barWidth = Math.floor(width / data.length);
//
//     return (
//         <svg width={width} height={height}>
//             {data.map((d, i) =>
//                 <rect
//                     key={i}
//                     x={i * barWidth}
//                     y={yScale(d)}
//                     width={barWidth - 1}
//                     height={height - yScale(d)}
//                 />,
//             )}
//         </svg>
//     );
// }

export class LineChart extends Component<CurveProps, {}> {
    render() {

        const margin = 20;
        const {width, height, data} = this.props;

        const h = height - 2 * margin, w = width - 2 * margin;

        //number formatter
        const xFormat = d3.format('.2');

        //x scale
        const x = d3.scaleLinear()
        // @ts-ignore
            .domain(d3.extent(data, d => d.a)) //domain: [min,max] of a
            .range([margin, w]);

        //y scale

        const y = d3.scaleLinear()
        // @ts-ignore
            .domain([0, d3.max(data, d => d.b)]) // domain [0,max] of b (start from 0)
            .range([h, margin]);

        //line generator: each point is [x(d.a), y(d.b)] where d is a row in data
        // and x, y are scales (e.g. x(10) returns pixel value of 10 scaled by x)
        const line = d3.line()
            // @ts-ignore
            .x(d => x(d.a))
            // @ts-ignore
            .y(d => y(d.b))
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

        return  (
            <svg width={width} height={height}>
                <line className="axis" x1={margin} x2={w} y1={h} y2={h}/>
                <line className="axis" x1={margin} x2={margin} y1={margin} y2={h}/>
                // @ts-ignore
                <path d={line(data)}/>
                <g className="axis-labels">
                    {xTicks}
                </g>
                <g className="axis-labels">
                    {yTicks}
                </g>
            </svg>
        )
    }
}