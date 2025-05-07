
import PrescriptionForm from '../components/PrescriptionForm';
import '../css/PrescriptionForm.css'

const PrescriptionPage = () => {
    return (
        <div className='bg-main4 bg-cover bg-no repeat main-container p-6 h-screen  w-full flex flex-col items-center'>
            <PrescriptionForm />
        </div>
    );
};
export default PrescriptionPage;