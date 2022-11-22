import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../components/App';
import EntryLevel from '../components/EntryLevel';
import Clownlist from '../components/Clownlist';
import Offsite from '../components/Offsite';
Object.assign(global, require('jest-chrome'));


describe('App Component', () => {
  it('should render initial layout', () => {
    render(<App />);
    const entryLevel = screen.getByText(/Entry Level Threshold/i);
    expect(entryLevel).toBeInTheDocument();
    const clownlist = screen.getByText(/Clownlisted Keywords/i);
    expect(clownlist).toBeInTheDocument();
    const submit = screen.getByText(/Apply settings and reload/i);
    expect(submit).toBeInTheDocument();
    const report = screen.getByText(/Report a bug/i);
    expect(report).toBeInTheDocument();
  });
});

describe('Entry Level Component', () => {
  it('should render initial layout', () => {
    const spy = jest.fn();
    render(<EntryLevel updateEntryLevel={spy} defaultSlider={5} />);
    const title = screen.getByText(/Entry Level Threshold/i);
    expect(title).toBeInTheDocument();
    const disabled = screen.getByText(/Disabled/i);
    expect(disabled).toBeInTheDocument();
    const sevenYears = screen.getByText(/7 years/i);
    expect(sevenYears).toBeInTheDocument();
  });
});

describe('Clownlist Component', () => {
  it('should render initial layout', () => {
    const mock = jest.fn();
    const clownlist = { silly: true, job: true };
    render(<Clownlist updateClownlist={mock} clownlist={clownlist} />);

    const title = screen.getByText(/Clownlisted Keywords/i);
    expect(title).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/NFT, unpaid, etc./i);
    expect(input).toBeInTheDocument();
    const addButton = screen.getByText(/Add/i);
    expect(addButton).toBeInTheDocument();
    const clearButton = screen.getByText(/Clear/i);
    expect(clearButton).toBeInTheDocument();
    const keyword1 = screen.getByText(/silly/i);
    expect(keyword1).toBeInTheDocument();
    const keyword2 = screen.getByText(/job/i);
    expect(keyword2).toBeInTheDocument();
  });

  it('should trigger add callback when user input submitted', async () => {
    const user = userEvent.setup();
    const mock = jest.fn();
    const clownlist = {};
    render(<Clownlist updateClownlist={mock} clownlist={clownlist} />);
    const input = screen.getByPlaceholderText(/NFT, unpaid, etc./i);
    await user.type(input, 'haberdasher');
    await user.keyboard('{Enter}');
    expect(mock).toHaveBeenCalled();
  });

  it('should trigger removal callback when keyword close button clicked', async () => {
    const user = userEvent.setup();
    const mock = jest.fn();
    const clownlist = { haberdasher: true };
    render(<Clownlist updateClownlist={mock} clownlist={clownlist} />);
    const close = screen.getByText(/x/i);
    await user.click(close);
    expect(mock).toHaveBeenCalled();
  });

  it('should trigger clear callback when clear button clicked', async () => {
    const user = userEvent.setup();
    const mock = jest.fn();
    const clownlist = { haberdasher: true };
    render(<Clownlist updateClownlist={mock} clownlist={clownlist} />);
    const clear = screen.getByText(/Clear/i);
    await user.click(clear);
    expect(mock).toHaveBeenCalled();
  });
});

describe('Offsite Component', () => {
  render(<Offsite />);
  const clown = screen.getAllByAltText(/sad clown/i)[0];
  expect(clown).toBeVisible();
  const p1 = screen.getByText(/Uh-oh! Looks like you aren't on a LinkedIn job post./i);
  expect(p1).toBeInTheDocument();
  const p2 = screen.getByText(/Please visit the LinkedIn job board to use Clown Detector./i);
  expect(p2).toBeInTheDocument();
});