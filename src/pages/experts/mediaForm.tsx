import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { wrapper, WrappedComponent } from 'state'
import { Overlay, Classes, Intent, Button, FormGroup, Icon } from "@blueprintjs/core";
import { UploadManager, VideoPreview} from 'tools';
import { User } from 'models';


const MediaForm: WrappedComponent<{ close: () => void, user: User}> = (props) => {
    const { close, useGlobalState, user, requests } = props;

    const { register, handleSubmit, getValues, errors } = useForm<{
        photos: Iterable<File>,
        videos: Iterable<File>,
    }>({
        defaultValues: {
            photos: [],
            videos: [],
        }
    })
    const [ photos, updatePhotos ] = useState<File[]>([]);
    const [ videos, updateVideos ] = useState<File[]>([]);

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
            <div className={Classes.CARD} style={{ left: "calc(50vw - 400px)", width: 800, margin: '10vh 0' }}>
            <form onSubmit={handleSubmit(data => {

                requests.user.update(
                    uploadedPhotos,
                    uploadedVideos,
                )
                .then(() => {
                    updateStatus('SEND')
                });
            })}>
                <h3>Add media files</h3>

                <FormGroup contentClassName='flex'>
                    {user.photos.map((img, idx) => {
                        return (
                            <div key={idx} style={{ width: 100, height: 100, margin: 5, position: 'relative' }}>
                                <img
                                    alt={img.name}
                                    key={img.id}
                                    src={`http://localhost:1337${img.url}`}
                                    style={{ width: 100, height: 100 }}
                                />
                                <Icon
                                    icon='delete'
                                    style={{ position: 'absolute', left: 0,top: 0, cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.6)'}}
                                    onClick={() => {
                                        requests.file.delete(img.id)
                                    }}
                                />
                            </div>
                        );
                    })}
                </FormGroup>

                <FormGroup contentClassName='flex'>
                    {user.videos.map((video, idx) => <VideoPreview video={video} canDelete={true} key={idx}/> )}
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
                        wasSend={status as string}
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

export default wrapper(MediaForm)