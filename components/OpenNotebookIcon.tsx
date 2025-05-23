import React from 'react';

// This component renders the OpenNotebook icon as an <img> tag for easy use in React components.
// The icon file should be in the project root as 'open_notebook_icon_transparent.png'.

const OpenNotebookIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style = {} }) => (
  <img
    src="open_notebook_icon_transparent.png"
    alt="OpenNotebook Icon"
    className={className}
    style={style}
    width={32}
    height={32}
    draggable={false}
  />
);

export default OpenNotebookIcon;
