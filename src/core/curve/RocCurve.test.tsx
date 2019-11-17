import {buildRocCurve, RocCurveProps} from "./RocCurve";
import {configure, shallow, ShallowWrapper} from "enzyme";
import { create, ReactTestRenderer } from 'react-test-renderer';
import Adapter from 'enzyme-adapter-react-16'

import * as React from "react";

let wrapper: ShallowWrapper<RocCurveProps>;
let snapshot: ReactTestRenderer;

beforeEach(() => {
    const mockPoints = {points: [[3,4],[4,5]]}
    const mockRocCurve = <h1>{mockPoints.points}</h1>;

    wrapper = shallow(mockRocCurve);
    snapshot = create(mockRocCurve);
});

configure({adapter: new Adapter()});

describe('buildRocCurve', () => {
    test('it matches the snapshot', () => {
        expect(snapshot.toJSON()).toMatchSnapshot();
    });

    // it('it should toggle checkbox label after click event', () => {
    //     expect(wrapper.text()).toEqual('Off');
    //
    //     wrapper.find('input').simulate('change');
    //
    //     expect(wrapper.text()).toEqual('On');
    // });
});