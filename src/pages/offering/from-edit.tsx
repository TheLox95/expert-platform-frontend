import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { wrapper, WrappedComponent } from 'state'
import { Overlay, Classes, Intent, Button, FormGroup, Icon } from "@blueprintjs/core";
import UploadManager from './UploadManager';
import { Offering } from 'models';
import VideoPreview from 'tools/VideoPreview';

let wasSend = false;

const Form: WrappedComponent<{ close: () => void, onSendOk: () => void, offering?: Offering}> = (props) => {
    const { close, http, onSendOk, useGlobalState, offering } = props;

    console.log(offering)
    const { register, handleSubmit, getValues, errors } = useForm<{
        title: string,
        description: string,
        photos: Iterable<File>,
        videos: Iterable<File>,
    }>({
        defaultValues: {
            title: offering?.name,
            description: offering?.description,
            photos: [],
            videos: [],
        }
    })
    const [ photos, updatePhotos ] = useState<File[]>([]);
    const [ videos, updateVideos ] = useState<File[]>([]);
    const [ user ] = useGlobalState('user');

    const [ uploadedPhotos, updateUploadedPhotos ] = useState<any[]>([]);
    const [ uploadedVideos, updateUploadedVideos ] = useState<any[]>([]);

    useEffect(() => {
        return () => { wasSend = false }
    },[]);

    return (
        <Overlay onClose={close} className={Classes.OVERLAY_SCROLL_CONTAINER} isOpen={true}>
            <div className={Classes.CARD} style={{ left: "calc(50vw - 400px)", width: 800, margin: '10vh 0' }}>
            <form onSubmit={handleSubmit(data => {
                const {
                    title,
                    description,
                } = data;
                http({
                    method: 'POST',
                    url: 'http://localhost:1337/offerings',
                    data: {
                        name: title,
                        description,
                        user: user?.id,
                        photos: uploadedPhotos.map(f => f.id),
                        videos: uploadedVideos.map(f => f.id)
                    }
                })
                .then((r) => {
                    wasSend = true;
                    onSendOk();
                    close();
                });
            })}>
                <h3>Create new Offering</h3>

                <div className="bp3-form-group">
                    <label className="bp3-label" htmlFor="title-input">Title</label>
                    <div className="bp3-input-group">
                    <input type="text" className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id="title-input" name='title' placeholder="Title" ref={register({ required: true })}/>
                    </div>
                    <div className="bp3-form-helper-text">{errors.title && 'Title is required'}</div>
                </div>

                <div className="bp3-form-group">
                    <label className="bp3-label" htmlFor="description-input">Description</label>
                    <div className="bp3-input-group">
                    <input type="text" className={`${errors.title ? 'bp3-intent-danger': 'bp3-intent-none'} bp3-input`} id={'description-input'} name='description' placeholder="Description" ref={register({ required: true })}/>
                    </div>
                    <div className="bp3-form-helper-text">{errors.description && 'Description is required'}</div>
                </div>

                <FormGroup>
                    {offering?.photos.map((img, idx) => {
                        return (
                            <div style={{ width: 100, height: 100, margin: 5, position: 'relative' }}>
                                <img
                                    alt={img.name}
                                    key={img.id}
                                    src={`http://localhost:1337${img.url}`}
                                    style={{ width: 100, height: 100 }}
                                    onClick={() => {
                                    }}
                                />
                                <Icon icon='delete' style={{ position: 'absolute', left: 0,top: 0, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.6)'}}/>
                            </div>
                        );
                    })}
                </FormGroup>

                <FormGroup>
                    {offering?.videos.map((video, idx) => <VideoPreview video={video} canClose={true} key={idx}/> )}
                </FormGroup>
                
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
                        wasSend={() => wasSend}
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
                        wasSend={() => wasSend}
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