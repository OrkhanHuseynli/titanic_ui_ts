import * as React from "react";
import {ChangeEvent, Component} from "react";
import RestClient from "../utils/RestClient";

export class FileSelector extends Component<{}, {}> {
    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectorFile: File) {
        RestClient.post(RestClient.ENDPOINT_UPLOAD, selectorFile, {});
        console.log(selectorFile);
    }

    render() {
        return <div>
            <input type="file" onChange={(e: ChangeEvent) => {
                const target = e.target as HTMLInputElement;
                const file: File = (target.files as FileList)[0];
                this.handleChange(file)
            }}/>
        </div>;
    }
}