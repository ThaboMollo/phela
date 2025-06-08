import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const Home: React.FC = () => {
  return (
    <Card className="max-w-xl mx-auto mt-10" placeholder="">
      <CardBody>
        <Typography variant="h4" className="mb-2" placeholder="">
          Welcome to Phela Health
        </Typography>
        <Typography color="gray" className="mb-4" placeholder="">
          This is the client portal for basic health app functions. You can log in to manage your profile, book appointments, view consultations, and access your medical records.
        </Typography>
      </CardBody>
    </Card>
  );
};

export default Home;

