import React from 'react';
import PrescriptionHistory from '../components/PrescriptionHistory';
import '../css/PrescriptionForm.css';

const PrescriptionHistoryPage = () => {
    return (
        <div className='bg-main4 bg-cover bg-no-repeat h-screen w-full flex flex-col overflow-hidden'>
            <PrescriptionHistory />
        </div>
    );
};

export default PrescriptionHistoryPage; 