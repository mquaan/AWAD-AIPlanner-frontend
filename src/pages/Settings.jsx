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
import { IoAdd, IoInformationCircleSharp } from "react-icons/io5";
import { getTimerSettings, updateTimerSettings } from "../service/timerApi";

const Settings = () => {
  const { setHeading, setActions } = usePage();
  useEffect(() => {
    setHeading("Settings");
    setActions([]);
  }, []);

  const { showToast } = useToast();

  const handleGetData = (tabIndex) => {
    if (tabIndex === 0) { // Fetch subjects data
      fetchSubjects();
    } else { // Fetch timer settings data
      fetchTimerSettings();
    }
  }

  useEffect(() => {
    fetchSubjects();
  }, []);

  // ----------- SUBJECTS SETTING -----------
  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogConfirmOpen, setIsDialogConfirmOpen] = useState(false);

  const [newName, setNewName] = useState('');

  const fetchSubjects = async () => {
    try {
      const response = await getSubjects();
      setSubjects(response.data);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch subjects");
    }
  };

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
  // ----------- END SUBJECTS SETTING -----------

  // ----------- TIMER SETTING -----------
  const [timerSettings, setTimerSettings] = useState(null);

  const [newTimerSettings, setNewTimerSettings] = useState({
    focus_time: 0,
    short_break_time: 0,
    long_break_time: 0,
    interval: 0
  })

  const fetchTimerSettings = async () => {
    try {
      const response = await getTimerSettings();
      setTimerSettings(response.data);
      setNewTimerSettings(response.data);
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch timer settings");
    }
  };

  const handleUpdateTimerSettings = async (e) => {
    e.preventDefault();

    try {
      const response = await updateTimerSettings(newTimerSettings);
      setTimerSettings(response.data);
      setNewTimerSettings(response.data);
      showToast("success", "Timer settings updated successfully");
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to update timer settings");
    }
  }
  // ----------- END TIMER SETTING -----------

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

            <div className="grid grid-cols-2 gap-4">
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
          <TabPanel className="space-y-4">
            <div className="">
              <h1 className="font-semibold">Time (minutes)</h1>
            </div>
            <form action="" className="space-y-4" onSubmit={handleUpdateTimerSettings}>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label htmlFor="ip-pomodoro-setting" className="text-sm font-medium">Pomodoro</label>
                  <InputField
                    id="ip-pomodoro-setting"
                    type="number"
                    min="1"
                    value={newTimerSettings.focus_time}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTimerSettings({ ...newTimerSettings, focus_time: value === "" ? "" : Number(value) })
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ip-short-break-setting" className="text-sm font-medium">Short Break</label>
                  <InputField
                    id="ip-short-break-setting"
                    type="number"
                    min="0"
                    value={newTimerSettings?.short_break_time}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTimerSettings({ ...newTimerSettings, short_break_time: value === "" ? "" : Number(value) })
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ip-long-break-setting" className="text-sm font-medium">Long Break</label>
                  <InputField
                    id="ip-long-break-setting"
                    type="number"
                    min="0"
                    value={newTimerSettings?.long_break_time}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTimerSettings({ ...newTimerSettings, long_break_time: value === "" ? "" : Number(value) })
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="ip-interval-setting" className="text-sm font-medium">Interval</label>
                  <InputField
                    id="ip-interval-setting"
                    type="number"
                    min="0"
                    value={newTimerSettings?.interval}
                    required
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTimerSettings({ ...newTimerSettings, interval: value === "" ? "" : Number(value) })
                    }}
                  />
                </div>
              </div>

              <p className="text-text-secondary flex gap-2 items-center">
                <IoInformationCircleSharp size={20} />
                <span className="font-semibold">Pomodoro sequence:</span> Pomodoro → short break, repeat number of intervals, then one long break
              </p>

              <div className="">
                <Button
                  type="submit"
                  className="w-[100px]"
                  disabled={
                    newTimerSettings.focus_time === timerSettings?.focus_time &&
                    newTimerSettings.short_break_time === timerSettings?.short_break_time &&
                    newTimerSettings.long_break_time === timerSettings?.long_break_time &&
                    newTimerSettings.interval === timerSettings?.interval
                  }
                >
                  Save
                </Button>
              </div>
            </form>
          </TabPanel>
        </Tab>
      </Tabs>

      {/* Dialog Subject */}
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
