import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../components/App';
import EntryLevel from '../components/EntryLevel';
import Clownlist from '../components/Clownlist';
import Offsite from '../components/Offsite';
Object.assign(global, require('jest-chrome'));


describe('Components', () => {
  test('App Component', () => {
    render(<App />);
    const entryLevel = screen.getByText('Entry Level Threshold');
    expect(entryLevel).toBeInTheDocument();
    const clownlist = screen.getByText('Clownlisted Keywords');
    expect(clownlist).toBeInTheDocument();
    const submit = screen.getByText('Apply settings and reload');
    expect(submit).toBeInTheDocument();
    const report = screen.getByText('Report a bug');
    expect(report).toBeInTheDocument();
  });

  test('Entry Level Component', () => {
    const spy = jest.fn();
    render(<EntryLevel updateEntryLevel={spy} defaultSlider={5} />);
    const title = screen.getByText('Entry Level Threshold');
    expect(title).toBeInTheDocument();
    const disabled = screen.getByText('Disabled');
    expect(disabled).toBeInTheDocument();
    const sevenYears = screen.getByText('7 years');
    expect(sevenYears).toBeInTheDocument();
  });

  test('Clownlist Component', () => {
    const spy = jest.fn();
    const clownlist = { silly: true, job: true };
    render(<Clownlist updateClownlist={spy} clownlist={clownlist} />);
    const title = screen.getByText('Clownlisted Keywords');
    expect(title).toBeInTheDocument();
    const input = screen.getByPlaceholderText('NFT, unpaid, etc.');
    expect(input).toBeInTheDocument();
    const addButton = screen.getByText('Add');
    expect(addButton).toBeInTheDocument();
    const clearButton = screen.getByText('Clear');
    expect(clearButton).toBeInTheDocument();
    const keyword1 = screen.getByText('silly');
    expect(keyword1).toBeInTheDocument();
    const keyword2 = screen.getByText('job');
    expect(keyword2).toBeInTheDocument();
  });

  test('Offsite Component', () => {
    render(<Offsite />);
    const clown = screen.getAllByAltText('sad clown')[0];
    expect(clown).toBeVisible();
    const p1 = screen.getByText('Uh-oh! Looks like you aren\'t on a LinkedIn job post.');
    expect(p1).toBeInTheDocument();
    const p2 = screen.getByText('Please visit the LinkedIn job board to use Clown Detector.');
    expect(p2).toBeInTheDocument();
  });
});
