import React, { useState } from 'react';
import { Card, CardBody, Typography, Input, Button } from '@material-tailwind/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // TODO: Implement authentication logic
    setTimeout(() => {
      setLoading(false);
      setError('Invalid credentials (demo only)');
    }, 1000);
  };

  return (
    <Card className="max-w-md mx-auto mt-10" placeholder="">
      <CardBody>
        <Typography variant="h4" className="mb-4" placeholder="">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder=""
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder=""
          />
          {error && <Typography color="red" className="text-sm" placeholder="">{error}</Typography>}
          <Button type="submit" color="blue" fullWidth loading={loading} placeholder="">
            Log In
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default Login;

