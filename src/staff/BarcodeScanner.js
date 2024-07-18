import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import config from '../config/config';
import "./BarcodeScanner.css"

const BarcodeScanner = () => {
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');

    const startScan = () => {
        setScanning(true);
    };

    const handleScan = async () => {
        if (!scanning) return;
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            try {
                const code = await decodeBarcode(imageSrc);
                if (code) {
                    setBarcode(code);
                    await addToCart(code);
                    setScanning(false);
                }
            } catch (error) {
                console.error('Barcode decoding failed', error);
            }
        }
    };

    const decodeBarcode = async (imageSrc) => {
        const codeReader = new BrowserMultiFormatReader();
        try {
            const result = await codeReader.decodeFromImage(undefined, imageSrc);
            return result.text;
        } catch (error) {
            return null;
        }
    };

    const addToCart = async (code) => {
        axios.post(`${config.API_ROOT}/api/Cart/add`,
            {
                productId: code,
                quantity: 1
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then(response => {
            })
            .catch(error => {
                console.error('There was an error adding the product to the cart!', error);
            });

    };

    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(handleScan, 300); // Quét mỗi 300ms
        } else if (interval) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [scanning]);

    return (
        <div className='scan-barcode'>
            <h1>Barcode Scanner</h1>
            {scanning && (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={640}
                    height={480}
                />
            )}
            {!scanning && <button onClick={startScan}>Start Scan</button>}
            <p>{barcode ? `Scanned Barcode: ${barcode}` : 'No barcode scanned yet'}</p>
            <p>{message}</p>
        </div>
    );
};

export default BarcodeScanner;
