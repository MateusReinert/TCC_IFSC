import './App.css';
import ResponsiveDrawer from './modules/userSettings/components/drawers/SettingsDrawer';
import PasswordInput from './shared/components/inputs/PasswordInput';
import TextInput from './shared/components/inputs/TextInput';

function App() {
  return (
    <div className="App">
      <TextInput></TextInput>
      <PasswordInput></PasswordInput>
      <ResponsiveDrawer></ResponsiveDrawer>
    </div>
  );
}

export default App;
