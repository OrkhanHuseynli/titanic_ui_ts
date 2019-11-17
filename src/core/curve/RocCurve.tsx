import * as React from 'react';
// @ts-ignore
import rd3 from 'react-d3-library'


export interface RocCurveProps {
    points : number[][];
}


export const buildRocCurve: React.FunctionComponent<RocCurveProps> = (props) => {

    return <h1>{props.points}</h1>;
};