

export default function MedicalHistoryList ({ medicalInfo }) {
  const sections = [
    { title: "Allergies", data: medicalInfo.allergies },
    { title: "Chronic Conditions", data: medicalInfo.chronicConditions },
    { title: "Current Medications", data: medicalInfo.currentMedications },
    { title: "Past Surgeries", data: medicalInfo.pastSurgeries },
  ];

  return (
    <div className="space-y-6 mt-6">
      {
        sections.map(section => (
          <div key={section.title} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
            { section.data && section.data.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                { section.data.map((item, index) => (
                  <li key={index}>{item}</li>
                )) }
              </ul>
            ) : (
              <p className="text-gray-500">No { section.title.toLowerCase() } recorded</p>
            ) }
          </div>
        ))
      }
    </div>
  )
}