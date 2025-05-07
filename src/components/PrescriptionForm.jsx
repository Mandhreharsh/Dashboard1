import React, { useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Pulse from "../images/pulse.png";
import prescriptionIcon from "../images/prescriptionIcon.png"
import "../css/PrescriptionForm.css"

const PrescriptionForm = () => {
  const ref = React.useRef(null)
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [prescriptionDate, setPrescriptionDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", quantity: "", refills: "" },
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      patientName,
      dateOfBirth,
      address,
      contactNumber,
      prescriptionDate,
      doctorName,
      doctorEmail,
      doctorContact,
      patientEmail,
      medicines,
    };

    try {
      await axios.post("http://localhost:7000/api/prescriptions", data);
      alert("Prescription saved successfully!");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription. Please check the fields.");
    }
  };

  const handleSendPrescription = async () => {
    if (!patientName || !patientEmail || !doctorName || !doctorEmail) {
      alert("Patient and doctor information are required.");
      return;
    }

    if (medicines.length === 0 || !medicines[0].name) {
      alert("Please add at least one medicine.");
      return;
    }

    const content = ref.current;
    if (!content) {
      alert("Prescription content is not ready.");
      return;
    }

    setIsSending(true);

    try {
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.innerHTML = content.innerHTML;
      document.body.appendChild(tempDiv);
      const htmlContent = tempDiv.outerHTML;

      document.body.removeChild(tempDiv);

      const response = await axios.post("http://localhost:7000/api/prescriptions/send", {
        patientName,
        dateOfBirth,
        address,
        contactNumber,
        prescriptionDate,
        doctorName,
        doctorEmail,
        doctorContact,
        patientEmail,
        medicines,
        htmlContent
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error sending prescription:", error);
      alert("Failed to send prescription: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSending(false);
    }
  };



  const deleteMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", frequency: "", quantity: "", refills: "" },
    ]);
  };

  const handleDownloadPDF = () => {
    const content = ref.current;

    if (!content) return;

    content.style.display = "block";

    const options = {
      filename: "prescription.pdf",
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      margin: [10, 10, 10, 10],
      image: { type: "jpeg", quality: 0.98 },
    };

    html2pdf()
      .from(content)
      .set(options)
      .save()
      .then(() => {
        content.style.display = "none";
      });
  };


  return (
    <div className="main-container-header">
      <div className="container-header flex flex-row mt-[20px] gap-3">
        <img className="container-header-img h-[30px] w-[30px]" src={prescriptionIcon} alt="" />
        <h1 className="font-semibold text-xl mt-[4px]">Prescription Page</h1>
      </div>
      <form className=" h-[600px] container shadow-xl rounded-lg overflow-x-hidden overflow-auto scrollbar-hide  mt-[20px] p-5 overflow-scroll" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <div>
            <h1 className="font-semibold text-xl">Patient Details</h1>
          </div>
          <div className="flex input-box1 flex-row flex-wrap justify-between mt-[15px]">
            <div class="coolinput flex flex-col">
              <label for="input" class="text">Patient Name:</label>
              <input
                type="text"
                name="input"
                class="input input1 border border-black w-[610px]"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div class="coolinput flex flex-col">
              <label for="input" class="text">Contact Number:</label>
              <input
                type="text"
                name="input"
                class="input input2  border border-black w-[610px]"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex input-box2 flex-row flex-wrap justify-between">
            <div className="coolinput flex flex-col">
              <label htmlFor="date-of-birth" className="text">Date of Birth:</label>
              <input
                type="date"
                id="date-of-birth"
                class="input input3  border border-black w-[400px]"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>

            <div className="coolinput flex flex-col">
              <label for="input" class="text">Patient Email:</label>
              <input
                type="email"
                name="input "
                class="input input4  border border-black w-[400px]"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                required
              />
            </div>

            <div class="coolinput flex flex-col">
              <label for="input" class="text">Prescription Date:</label>
              <input
                type="date"
                name="input"
                class="input input5  border border-black w-[400px]"
                value={prescriptionDate}
                onChange={(e) => setPrescriptionDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="input-box3 ">
            <div class="coolinput flex flex-col">
              <label for="input" class="text">Address:</label>
              <textarea
                type="text"
                name="input"
                class="input input6  border border-black "
                rows={3}
                cols={200}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
















        <div>
          <h1 className="font-semibold text-xl mt-[20px]">Medicines</h1>
          <form className=" mt-[15px]">
            <div className="">
              {medicines.map((medicine, index) => (
                <div key={index} className="flex flex-row input-box3 gap-3 mb-2 flex-wrap ">
                  <div class="coolinput">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      name="input"
                      class="input w-[230px]"
                      value={medicine.name}
                      onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                      required
                    />
                  </div>
                  <div class="coolinput">
                    <input
                      type="text"
                      placeholder="Dosage"
                      name="input"
                      class="input w-[230px]"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      required
                    />
                  </div>
                  <div class="coolinput">
                    <input
                      type="text"
                      placeholder="Frequency"
                      name="input"
                      class="input w-[230px]"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                      required
                    />
                  </div>
                  <div class="coolinput">
                    <input
                      type="text"
                      placeholder="Quantity"
                      name="input"
                      class="input w-[230px]"
                      value={medicine.quantity}
                      onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                      required
                    />
                  </div>
                  <div class="coolinput">
                    <input
                      type="text"
                      placeholder="Refills"
                      name="input"
                      class="input w-[230px]"
                      value={medicine.refills}
                      onChange={(e) => handleMedicineChange(index, "refills", e.target.value)}
                      required
                    />
                  </div>
                  <button type="button" onClick={() => deleteMedicine(index)} className="bg-red-500  shadow-red-500/30 shadow-xl text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              ))}
              <button type="button" onClick={addMedicine} className="bg-blue-500 shadow-blue-500/30 shadow-xl  text-white px-3 py-2 mt-2 rounded">
                Add Medicine
              </button>
            </div>
          </form>
        </div>





















        <div className="flex flex-col gap-1">
          <div className="mt-[20px]">
            <h1 className="font-semibold text-xl">Doctor Details</h1>
          </div>
          <div className="flex flex-row input-box4 flex-wrap input-box4 justify-between mt-[15px]">
            <div class="coolinput flex flex-col">
              <label for="input" class="text">Doctor Name:</label>
              <input
                type="text"
                name="input"
                class="input input7  border border-black w-[400px]"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                required
              />
            </div>
            <div class="coolinput flex flex-col">
              <label for="input" class="text">Doctor Email:</label>
              <input
                type="email"
                name="input"
                class="input input8  border border-black w-[400px]"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                required
              />
            </div>
            <div class="coolinput flex flex-col">
              <label for="input" class="text">Doctor Contact:</label>
              <input
                type="text"
                name="input"
                class="input input9  border border-black w-[400px]"
                value={doctorContact}
                onChange={(e) => setDoctorContact(e.target.value)}
                required
              />
            </div>
          </div>
        </div>


        <div className="flex flex-row justify-end gap-9 mt-[35px]">
          <button
            className="bg-indigo shadow-indigo/30 shadow-xl h-[40px] rounded-md w-[150px] flex items-center justify-center"
            type="button"
            onClick={handleSendPrescription}
            disabled={isSending}
          >
            {isSending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                <span>Sending...</span>
              </>
            ) : (
              "Send Prescription"
            )}
          </button>
          <button
            className="bg-Blue100 shadow-Blue100/30 shadow-xl h-[40px] rounded-md w-[150px]"
            type="button"
            onClick={handleDownloadPDF}
            disabled={isSending}
          >
            Download PDF
          </button>
        </div>
      </form>

      <div ref={ref} id="prescription-content" style={{ display: "none" }}>
        <div className="prescription-wrapper">
          <div className="flex justify-center">
            <div className="h-[120px] w-[160px] ml-[10px] bg-white flex flex-col justify-center items-center">
              <div>
                <img className="h-[80px] w-[80px]" src={Pulse} alt="HealthAxis Logo" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Health<span className="text-darkBlue">Axis</span></h1>
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-semibold mt-4">Medical Prescription</h2>

          <div className="doctor-info mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Prescribing Doctor</h3>
            <p className="font-semibold">Name: <span className="font-normal">{doctorName}</span></p>
            <p className="font-semibold">Email: <span className="font-normal">{doctorEmail}</span></p>
            <p className="font-semibold">Contact: <span className="font-normal">{doctorContact}</span></p>
            <p className="font-semibold">Prescription Date: <span className="font-normal">{prescriptionDate}</span></p>
          </div>

          <h3 className="text-xl font-semibold mb-2 mt-[30px]">I. Patient Information</h3>
          <div className="flex justify-center mt-5">
            <table className="border-collapse border border-gray-300 w-[900px] text-left">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Field</th>
                  <th className="border border-gray-300 px-4 py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Patient Name</td>
                  <td className="border border-gray-300 px-4 py-2 font-bold">{patientName}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Date of Birth</td>
                  <td className="border border-gray-300 px-4 py-2">{dateOfBirth}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Address</td>
                  <td className="border border-gray-300 px-4 py-2">{address}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Contact Number</td>
                  <td className="border border-gray-300 px-4 py-2">{contactNumber}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-semibold">Email</td>
                  <td className="border border-gray-300 px-4 py-2">{patientEmail}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-[30px]">
            <div className="w-[900px]">
              <h2 className="text-xl font-semibold mb-2">II. Medication Details</h2>
              <p className="mb-3 text-sm italic">Take medications as prescribed. Do not adjust dosage without consulting your doctor.</p>
              <table className="border-collapse border border-gray-300 w-full text-left mt-[10px]">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Medication Name</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Dosage</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Frequency</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Quantity</th>
                    <th className="border border-gray-300 px-4 py-2 font-semibold">Refills</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.map((med, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">{med.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{med.dosage}</td>
                      <td className="border border-gray-300 px-4 py-2">{med.frequency}</td>
                      <td className="border border-gray-300 px-4 py-2">{med.quantity}</td>
                      <td className="border border-gray-300 px-4 py-2">{med.refills}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <div className="w-[900px]">
              <h2 className="text-xl font-semibold mb-3">III. Additional Information</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="mb-2">This prescription is valid for 30 days from the date of issue.</p>
                <p className="mb-2">Store all medications in a cool, dry place away from direct sunlight.</p>
                <p className="mb-2">Keep all medications out of reach of children.</p>
                <p className="mb-2">Report any adverse reactions to your doctor immediately.</p>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default PrescriptionForm;
