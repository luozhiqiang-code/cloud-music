import styled, { keyframes } from "styled-components";
import React from "react";
const scroll = keyframes`
  0%{
    transform:translateX(100%);
  }
  50%{
    transform:translateX(0);;
  }
  100%{
    transform:translateX(-100%);
  }
`;
export const Marquee = styled.div`
  overflow: hidden;
  width: 100%;
  & :first-child {
    animation: ${scroll} linear 4s infinite;
  }
`;
