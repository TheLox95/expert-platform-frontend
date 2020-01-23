import React, { useState, useEffect } from 'react';
import { wrapper, WrappedComponent } from "state";
import Markdown from 'markdown-to-jsx';
import { Offering, Photo, Video, Opinion } from 'models';
import { useParams } from 'react-router-dom';
import { Classes, Card, Tabs, Tab, Callout, Tag, Text } from '@blueprintjs/core';
import { VideoPreview } from 'tools';
import ImageGallery from 'tools/ImagesGallery';

const Description: React.FunctionComponent<{ offering: Offering }> = ({ offering }) => {
    return (
        <Markdown style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
            {offering ? offering.description : ''}
        </Markdown>
    );
}

const Media: React.FunctionComponent<{ images: Photo[], videos: Video[] }> = ({ images, videos }) => {
    return (
        <>
        <ImageGallery images={images} />
        {videos.map((video, idx) => <VideoPreview video={video} key={idx}/>)}
        </>
    );
}

const Opinions: React.FunctionComponent<{ opinions: Opinion[] }> = ({ opinions }) => {
    if (opinions.length === 0) {
        return (
            <>
            <Text>No opinions for this offering</Text>
            </>
        );
    }
    return (
        <>
        {opinions.map((o, idx) => {
            return (
                <Callout key={idx}>
                    <Tag>Score {o?.score}</Tag>{' '}
                    by <span>{typeof o.user === 'object' ? o.user.username : ''}</span>{' '}
                    <h2>{o?.description}</h2>
                </Callout>
            );
        })}
        </>
    );
}


const OfferingComponent: WrappedComponent = ({ requests }) => {
    const { id } = useParams();
    const [ offering, updateOffering ] = useState<Offering | null>(null);
    const [ tab, updateTab ] = useState('Info');

    useEffect(() => {
        requests.offering.get(id)
        .then((offering: Offering) => updateOffering(offering));
    }, [id]);

    return (
        <>
        <Card style={{ display: 'flex', marginBottom: '1.5rem' }} className={offering === null ? Classes.SKELETON: ''}>
            <div style={{ marginLeft: '1rem'}}>
                <h2>{offering?.name}</h2>
            </div>
        </Card>
        <Card style={{ height: 'auto' }}>
            <Tabs
                animate={true}
                id="navbar"
                large={false}
                onChange={(id) => updateTab(typeof id === 'string' ? id : 'Info')}
                renderActiveTabPanelOnly={true}
                selectedTabId={tab}
            >
                <Tab id="Info" title="Info" panel={offering ? <Description offering={offering} /> : undefined} />
                <Tab id="Media" title="Media" panel={<Media images={offering?.photos ?? []} videos={offering?.videos ?? []} />} />
                <Tab id="Opinion" title="Opinion" panel={<Opinions opinions={offering?.opinions ?? []} />} />
            </Tabs>
        </Card>
        
        </>
    );
}

export default wrapper(OfferingComponent)