import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from '../app';
import fs from 'fs';
import path from 'path';
import { act } from 'react-dom/test-utils';

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

// !Everything after this point is WiP

// TODO: Refactor application to avoid so many moving pieces
// TODO: Move HTTP call to higher-order component or custom Hook
test.skip('dropping file', async () => {
    const wrapper = render(<App />);

    const fileContents = fs.readFileSync(path.join(__dirname, '__fixtures__/sample.aax'));
    const file = new File([fileContents], 'sample.aax', { type: '' });
    const eventData = mockData([file]);

    const dropperElement = await wrapper.findByText('Checksum or Drag&Drop .aax file -');
    const dropZoneSection = await dropperElement.closest('section');
    const dropZoneFile = await dropZoneSection.querySelector('input[type="file"]');

    await act(async () => {
        dispatchEvt(dropZoneFile, 'drop', eventData);
    });

    const activationBytesInput = wrapper.container.querySelector('#activationBytes');
    expect(activationBytesInput.value).toBe('62689101');
});

// TODO: Move into Test Helpers
function dispatchEvt(node, type, data) {
    const event = new Event(type, { bubbles: true })
    Object.assign(event, data)
    fireEvent(node, event)
}

// TODO: Move into Test Helpers
function mockData(files) {
    return {
        dataTransfer: {
            files,
            items: files.map(file => ({
                kind: 'file',
                type: file.type,
                getAsFile: () => file
            })),
            types: ['Files']
        }
    }
}

// TODO: Move into Test-specific Polyfill
(function () {
    File.prototype.arrayBuffer = File.prototype.arrayBuffer ?? myArrayBuffer;
    Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer ?? myArrayBuffer;

    function myArrayBuffer() {
        // this: File or Blob
        return new Promise((resolve) => {
            let fr = new FileReader();
            fr.onload = () => {
                resolve(fr.result);
            };
            fr.readAsArrayBuffer(this);
        })
    }
})();
