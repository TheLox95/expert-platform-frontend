import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { wrapper, WrappedComponent } from 'state'
import { Overlay, Classes, Intent, Button, FormGroup } from "@blueprintjs/core";
import { UploadManager } from 'tools';

const Form: WrappedComponent<{ close: () => void }> = (props) => {
    const { close, useGlobalState, requests } = props;
    const { register, handleSubmit, getValues, errors } = useForm()
    const [ photos, updatePhotos ] = useState<File[]>([]);
    const [ videos, updateVideos ] = useState<File[]>([]);
    const [ user ] = useGlobalState('user');

    const [ uploadedPhotos, updateUploadedPhotos ] = useState<any[]>([]);
    const [ uploadedVideos, updateUploadedVideos ] = useState<any[]>([]);

    const [ status, updateStatus ] = useState<'OPENED' | 'CANCELLED' | 'SEND'>('OPENED');

    useEffect(() => {
        if (status === 'SEND') {
            close();
        }
        if (status === 'CANCELLED') {
            close();
        }
    },[status]);

    return (
        <Overlay onClose={() => updateStatus('CANCELLED')} className={Classes.OVERLAY_SCROLL_CONTAINER} isOpen={true}>
            <div className={Classes.CARD} style={{ left: "calc(50vw - 200px)", width: 400, margin: '10vh 0' }}>
            <form onSubmit={handleSubmit(data => {
                const {
                    title,
                    description,
                } = data;
                requests.offering.create(title, description, user, uploadedPhotos, uploadedVideos)
                .then(() => {
                    updateStatus('SEND');
                    close();
                });
            })}>
                <h3>Create new Offering</h3>

                <div className="bp3-form-group">
                    <label className="bp3-label" htmlFor="offering-title-input">Title</label>
                    <div className="bp3-input-group">
                    <input type="text" className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="offering-title-input" name='title' placeholder="Title" ref={register({ required: true })}/>
                    </div>
                    <div className="bp3-form-helper-text">{errors.title && 'Title is required'}</div>
                </div>

                <div className="bp3-form-group">
                    <label className="bp3-label" htmlFor="offering-description-input">Description</label>
                    <div className="bp3-input-group">
                    <textarea className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'offering-description-input'} name='description' placeholder="Description" ref={register({ required: true })}/>
                    </div>
                    <div className="bp3-form-helper-text">{errors.description && 'Description is required'}</div>
                </div>

                <FormGroup>
                    <label className="bp3-file-input bp3-fill">
                        <input name="photos" id={'photos-input'} multiple={true} type="file" accept="image/*" ref={register} onChange={() => {
                            updatePhotos((prev) => {
                                const photos = Array.from<File>(getValues().photos);
                                const names = prev.map(p => p.name)
                                const newFiles = photos.filter((p) => !names.includes(p.name) )
                                return [...prev, ...newFiles]
                            })
                        }}/>
                        <span className="bp3-file-upload-input">Photos</span>
                    </label>
                    {photos ? <UploadManager
                        files={photos}
                        wasSend={status}
                        onUploadedFiles={(uploaded) => updateUploadedPhotos(uploaded)}
                        onDelete={(file) => {
                            updatePhotos((prev) => {
                                return prev.filter(f => f.name !== file.name)
                            });
                        }}
                        /> : null}
                </FormGroup>


                <FormGroup>
                    <label className="bp3-file-input bp3-fill">
                        <input name="videos" id={'videos-input'} multiple={true} type="file" accept="video/*" ref={register} onChange={() => {
                            updateVideos((prev) => {
                                const videos = Array.from<File>(getValues().videos);
                                const names = prev.map(p => p.name)
                                const newFiles = videos.filter((p) => !names.includes(p.name) )
                                return [...prev, ...newFiles]
                            })
                        }}/>
                        <span className="bp3-file-upload-input">Videos</span>
                    </label>
                    {videos ? <UploadManager
                        files={videos}
                        wasSend={status}
                        onUploadedFiles={(uploaded) => updateUploadedVideos(uploaded)}
                        onDelete={(file) => {
                            updateVideos((prev) => {
                                return prev.filter(f => f.name !== file.name)
                            });
                        }}
                        /> : null}
                </FormGroup>

                <br />
                <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button intent={Intent.DANGER} onClick={() => updateStatus('CANCELLED')} style={{ margin: "" }}>
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