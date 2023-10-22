// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import { render, screen } from '@testing-library/react'
import React from "react";
import Spinner from "./Spinner";


describe(`Spinner tests`, () => {
  const spinnerText = () => screen.queryByText('Please wait...')
  
  test('StyledSpinner is present when Spinner on is equal true.', () => {
    render(<Spinner on={true}/>)
    expect(spinnerText()).not.toEqual(null)
  })
  
  test('StyledSpinner is not present when Spinner on is equal false.', () => {
    render(<Spinner on={false}/>)
    expect(spinnerText()).toEqual(null)
  })
})