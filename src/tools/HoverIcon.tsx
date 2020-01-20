import React, { useState } from 'react';
import { Icon, IconName } from '@blueprintjs/core';

const HoverIcon: React.FunctionComponent<{ color: string, onClick: () => void, icon: IconName, size?: number, style?: {} }> = (props) => {
    const { color, onClick, icon, size, style } = props;
    const [ isHovering, updateHovering ] = useState(false)


    return (
        <Icon
            iconSize={size ? size: 16}
            style={{ cursor: 'pointer', ...style }}
            icon={icon}
            color={isHovering ? color : ''}
            onMouseEnter={() => updateHovering(true)}
            onMouseLeave={() => updateHovering(false)}
            onClick={onClick}
        />
    );
}

export default HoverIcon;