import React, { useState } from 'react';
import { Icon, IconName } from '@blueprintjs/core';

const HoverIcon: React.FunctionComponent<{ color: string, onClick: () => void, icon: IconName}> = (props) => {
    const { color, onClick, icon } = props;
    const [ isHovering, updateHovering ] = useState(false)


    return (
        <Icon
            style={{ cursor: 'pointer' }}
            icon={icon}
            color={isHovering ? color : ''}
            onMouseEnter={() => updateHovering(true)}
            onMouseLeave={() => updateHovering(false)}
            onClick={onClick}
        />
    );
}

export default HoverIcon;