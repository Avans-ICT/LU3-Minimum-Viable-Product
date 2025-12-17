import React from 'react';

interface singleModuleProps {
    name: string;
    studycredit: number;
    location: string;
    level: string;
}

const SingleModule: React.FC<singleModuleProps> = ({ name, studycredit, location, level }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{location}</p>
      <p>{studycredit}</p>
      <p>{location}</p>
      <p>{level}</p>
    </div>
  );
};

export default SingleModule;