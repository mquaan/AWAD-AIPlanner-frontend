import { useEffect, useState } from "react";
import { usePage } from "../context/PageContext";
import { Tab, TabPanel, Tabs } from "../components/Tabs";
import { addSubject, deleteSubject, getSubjects, modifySubject } from "../service/subjectApi";
import { useToast } from "../context/ToastContext";
import SubjectCard from "../components/SubjectCard";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "../components/Dialog";
import Button from "../components/Button";
import InputField from "../components/InputField";
import DialogConfirm from "../components/DialogConfirm";
import { IoAdd } from "react-icons/io5";

const Settings = () => {
  const { setHeading, setActions } = usePage();
  useEffect(() => {
    setHeading("Settings");
    setActions([]);
  }, []);

  const { showToast } = useToast();

  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch subjects");
    }
  };

  const handleGetData = (tabIndex) => {
    if (tabIndex === 0) { // Fetch subjects data
      fetchSubjects();
    } else { // Fetch timer settings data
      console.log("Get timer data");
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

  const [newName, setNewName] = useState('');

  const handleCloseDialogSubject = () => {
    setIsDialogOpen(false);
    setSelectedSubject(null);
    setNewName('');
  };

  const handleUpdateSubject = async () => {
    try {
      const response = await modifySubject(selectedSubject.id, newName);
      
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject.id === selectedSubject.id ? response.data : subject
        )
      );

      showToast("success", "Subject updated successfully");

      setIsDialogOpen(false);
      setSelectedSubject(null);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to update subject");
    }
  }

  const handleAddSubject = async () => {
    try {
      const response = await addSubject(newName);
      
      setSubjects([...subjects, response.data]);

      showToast("success", "Subject added successfully");

      setIsDialogOpen(false);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to add subject");
    }
  }

  const handleConfirmSubject = async () => {
    if (selectedSubject) {
      handleUpdateSubject()
    } else {
      handleAddSubject()
    }
  };

  const handleOpenDialogSubject = (subject) => {
    setIsDialogOpen(true);
    if (subject !== null) {
      setSelectedSubject(subject);
      setNewName(subject.name);
    } else {
      setSelectedSubject(null);
      setNewName("");
    }
  }

  const handleOpenDeleteSubject = (subject) => {
    setIsDialogConfirmOpen(true);
    setSelectedSubject(subject);
  }

  const handleDeleteSubject = async () => {
    try {
      const response = await deleteSubject(selectedSubject.id);
      
      setSubjects((prevSubjects) =>
        prevSubjects.filter((subject) => subject.id !== response.data.id));

      showToast("success", "Subject deleted successfully");

      setIsDialogConfirmOpen(false);
      setSelectedSubject(null);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to delete subject");
    }
  }

  return (
    <>
      <Tabs className="" onTabChange={handleGetData}>
        <Tab label="Subjects">
          <TabPanel className="">
            <div className="w-full mb-6">
              <Button
                className="ml-auto w-fit"
                icon={IoAdd}
                onClick={() => handleOpenDialogSubject(null)}
              >
                Add Subject
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 h-full">
              {subjects?.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  onEdit={handleOpenDialogSubject}
                  onDelete={handleOpenDeleteSubject}
                />
              ))}
            </div>
          </TabPanel>
        </Tab>
        <Tab label="Timer">
          <TabPanel>
            <h2>Content for Tab 2</h2>
            <p>This is the content for the second tab.</p>
          </TabPanel>
        </Tab>
      </Tabs>

      {/* Dialog Edit Subject */}
      <Dialog isOpen={isDialogOpen} onClose={handleCloseDialogSubject}>
        <DialogHeader
          title={selectedSubject !== null ? "Edit subject" : "Add subject"}
          onClose={handleCloseDialogSubject}
        />
        <DialogBody>
          <InputField
            type="text"
            placeholder="Enter subject name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="secondary"
            className="w-fit"
            onClick={handleCloseDialogSubject}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="w-fit"
            onClick={handleConfirmSubject}
            disabled={newName === "" || newName === selectedSubject?.name}
          >
            Confirm
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Dialog confirm delete */}
      <DialogConfirm
        open={isDialogConfirmOpen}
        onClose={() => setIsDialogConfirmOpen(false)}
        onConfirm={handleDeleteSubject}
        title="Confirm"
        content="Are you sure you want to delete this subject?"
      />
    </>
  );
};

export default Settings;
