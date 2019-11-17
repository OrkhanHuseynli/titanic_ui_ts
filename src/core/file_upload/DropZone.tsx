import React, {Component, useCallback} from 'react';
import  Dropzone,  {DropEvent} from 'react-dropzone';
import RestClient from "../utils/RestClient";
import {Icon, Typography} from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';

const dropzoneStyle = {
    width  : "100%",
    height : "20%",
    border : "1px solid black"
};

type DropZoneState = {
    dropAreaMessage: any
}

export class DropZone extends Component<{}, DropZoneState> {

    constructor(props: any) {
        super(props);
        this.getDropAreaMessage = this.getDropAreaMessage.bind(this);
        this.onDropRejected = this.onDropRejected.bind(this);
        this.onDropAccepted = this.onDropAccepted.bind(this);
        this.setState = this.setState.bind(this);
        this.state = {
            dropAreaMessage: ""
        }
    }

    onDrop = <T extends File>(acceptedFiles: T[]): void => {
        if (acceptedFiles.length == 0){
            console.error(`${DropZone.name} : Failed to load file!`);
            return
        }
        let formData = new FormData();
        let fileName =  acceptedFiles[0].name;
        formData.set('filearg', acceptedFiles[0], fileName);
        let promise = RestClient.sendFormData("http://localhost:8888/uploads", formData,  new Headers());
        promise.then((res)=>{
            if (res.status !== 200){
                console.error("Upload has failed");
                console.log(res);
                this.onDropRejected()
            } else {
                console.log(`Successful upload of ${acceptedFiles[0].name}`);
                this.onDropAccepted(fileName)
            }
        })
    };

    getDropAreaMessage(){
        return this.state.dropAreaMessage
    }
    onDropAccepted(fileName:string): void{
        this.setState({dropAreaMessage:  <Typography color="primary">The file upload was successful : {fileName}</Typography>});
    };
    onDropRejected(): void{
        this.setState({dropAreaMessage:  <Typography color="error">The file upload was unsuccessful</Typography>});
    };

    render(){
        return(
            <div>
                <Dropzone accept=".csv" onDrop={this.onDrop} onDropRejected={this.onDropRejected}>
                    {({getRootProps, getInputProps, isDragActive, isDragReject}) => (
                        <section style={{backgroundColor: "#e0e0e0", width: "500px", height: "150px", margin: "0 auto"}}>
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {!isDragActive &&  <div style={{padding: '50px 0'}}><Typography color="textSecondary"  align={"center"}>Click here or drop a file to upload!</Typography></div>}
                                {isDragActive &&  <div style={{padding: '50px 0'}}><Typography color="textSecondary"  align={"center"}>Drop it like it's hot!</Typography></div>}
                            </div>
                        </section>
                    )}
                </Dropzone>
                <div>
                    {this.getDropAreaMessage()}
                </div>
            </div>
        );
    }
}


