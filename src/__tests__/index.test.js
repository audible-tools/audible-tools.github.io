import React from 'react'
import { render } from '@testing-library/react'
import App from '../app';

test('fresh component', async () => {
    const wrapper = render(<App />);
    expect(wrapper.container).toMatchSnapshot();
});

test('upload field is as expected', async () => {
    const wrapper = render(<App />);
    const dropperElement = await wrapper.findByText('Checksum or Drag&Drop .aax file -');
    expect(dropperElement).toMatchSnapshot();
});

test('button to request bytes has disabled attribute', async () => {
    const wrapper = render(<App />);
    // TODO: Improve... MUI Button seems to add unnecessary markup.
    const requestActivationButton = await (
        await wrapper.findByText('Request Activation Bytes')
    ).closest('button');
    expect(requestActivationButton).toHaveAttribute('disabled');
});