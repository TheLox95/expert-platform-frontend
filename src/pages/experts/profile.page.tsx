import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Redirect } from "react-router-dom";
import { wrapper, WrappedComponent } from "state";
import { Tabs, Tab, Card, Classes } from "@blueprintjs/core";
import { useParams } from "react-router-dom";
import Offerings from "./offerings"
import Info from "./info"
import Opinions from "./opinions"
import { HttpInstance } from 'requests';
import { Offering, Opinion, User } from 'models';

const getUser = (id: string, http: HttpInstance<{}>) => http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/users/${id}` }).then(r => r.data)
const getOfferings = (http: HttpInstance<{}>) => http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/offerings?_sort=created_at:desc` }).then(r => r.data)
const getOpinions = (http: HttpInstance<{}>) => http({ method: 'get', url: `${process.env.REACT_APP_BACKEND_URL}/opinions` }).then(r => r.data)

const Profile: WrappedComponent = ({ http, useGlobalState, i18n }) => {
    const { id } = useParams();
    const [tab, updateTab] = useState("Info");
    const [ loggedUser, updateLoggedUser ] = useGlobalState('user');

    useEffect(() => {
        axios.all([
            getUser(id || '1', http),
            getOfferings(http),
            getOpinions(http)
        ])
        .then(axios.spread((user, offerings, opinions) => {
            offerings = (offerings as Offering[]).map(offering => {
                offering.opinions = offering.opinions.map(originalOpinion => {
                    return (opinions as Opinion[]).filter(fullOpiniion => {
                        if (typeof fullOpiniion.user === 'object') {
                            return fullOpiniion.user.id === originalOpinion.user
                        }
                    })
                }).flat()
                return offering;
            })
            updateLoggedUser(user as User)
        }))
    }, [id, http]);

    return ( loggedUser !== null && loggedUser.role.type !== 'expert') ? <Redirect to="/" /> : (
        <>
        <Card id='profile-card' style={{ display: 'flex', marginBottom: '1.5rem' }} className={loggedUser === null ? Classes.SKELETON: ''}>
            <div>
                <img src="http://lorempixel.com/200/200/" alt=""/>
            </div>
            <div style={{ marginLeft: '1rem'}}>
                <h2 id='profile-name'>{loggedUser ? loggedUser.username.charAt(0).toUpperCase() + loggedUser.username.slice(1): ''}</h2>
                <p>{loggedUser?.aboutme}</p>
            </div>
        </Card>
        <Card style={{ height: 'auto' }}>
            <Tabs
                animate={true}
                id="navbar"
                large={false}
                onChange={(id) => updateTab(id as string)}
                renderActiveTabPanelOnly={true}
                selectedTabId={tab}
            >
                <Tab id="Info" title={i18n.t('info')} panel={<Info user={loggedUser}/>} />
                <Tab id="Offerings" title={i18n.t('offerings')} panel={<Offerings/>} />
                <Tab id="Opinions" title={i18n.t('opinions')} panel={<Opinions user={loggedUser}/>} />
            </Tabs>
        </Card>
        </>
    );
}

export default wrapper(Profile);