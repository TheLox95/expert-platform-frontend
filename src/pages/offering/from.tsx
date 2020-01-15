import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { wrapper, WrappedComponent } from 'state'
import { Overlay, Classes, Intent, Button, FormGroup } from "@blueprintjs/core";
import { HttpInstance, AllInterface } from 'state/http';
import Progress from './Progres';
import { AxiosPromise } from 'axios';
import UploadManager from './UploadManager';

const Form: WrappedComponent<{ isOpen: boolean, close: () => void}> = (props) => {
    const { register, handleSubmit, getValues, errors } = useForm()
    const { isOpen, close, All } = props;
    const [ photos, updatePhotos ] = useState<File[]>([]);
    const [ videos, updateVideos ] = useState<File[]>([]);

    return (
        <Overlay onClose={close} className={Classes.OVERLAY_SCROLL_CONTAINER} isOpen={isOpen}>
            <div className={Classes.CARD} style={{ left: "calc(50vw - 200px)", width: 400, margin: '10vh 0' }}>
            <form onSubmit={handleSubmit(data => { console.log(data) })}>
                <h3>Create new Offering</h3>

                <FormGroup
                    label="Title"
                    labelFor="title-input"
                >
                    <input type="text" className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="title-input" name='title' placeholder="Title" ref={register({ required: true })}/>
                    {errors.title && 'Title is required'}
                </FormGroup>

                <FormGroup
                    label="Description"
                    labelFor="description-input"
                >
                    <input type="text" className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'description-input'} name='description' placeholder="Description" ref={register({ required: true })}/>
                    {errors.description && 'Description is required'}
                </FormGroup>

                <FormGroup>
                    <label className="bp3-file-input bp3-fill">
                        <input name="photos" id={'photos-input'} multiple={true} type="file" ref={register} onChange={() => {
                            updatePhotos((prev) => {
                                const photos = Array.from<File>(getValues().photos);
                                const names = prev.map(p => p.name)
                                const newFiles = photos.filter((p) => !names.includes(p.name) )
                                return [...prev, ...newFiles]
                            })
                        }}/>
                        <span className="bp3-file-upload-input">Choose file...</span>
                    </label>
                    {photos ? <UploadManager files={photos} /> : null}
                </FormGroup>


                <FormGroup>
                    <label className="bp3-file-input bp3-fill">
                        <input name="videos" id={'videos-input'} type="file" ref={register} onChange={() => {
                            updateVideos((prev) => {
                                const photos = Array.from<File>(getValues().videos);
                                const names = prev.map(p => p.name)
                                const newFiles = photos.filter((p) => !names.includes(p.name) )
                                return [...prev, ...newFiles]
                            })
                        }}/>
                        <span className="bp3-file-upload-input">Choose file...</span>
                    </label>
                </FormGroup>

                <br />
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button intent={Intent.DANGER} onClick={close} style={{ margin: "" }}>
                        Close
                    </Button>
                    <Button type='submit' style={{ margin: "" }}>
                        Submit
                    </Button>
                </div>
            </form>
            </div>
        </Overlay>
    );
}

export default wrapper(Form)