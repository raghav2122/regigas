import React from 'react';
import './Install.css';
import './Install.scss';
import SupabaseClientApp from '../../supabase';

const Install = () => {
  return (
    <div className="App">
      <header className="App-header">
        <SupabaseClientApp />
        <h6>The color of this paragraph is defined using SASS.</h6>
      </header>
    </div>
  );
};

export default Install;
