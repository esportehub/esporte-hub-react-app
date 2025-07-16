import 'react';
import { SystemStyleObject } from '@chakra-ui/react';

declare module 'react' {
  interface Attributes {
    sx?: SystemStyleObject;
  }
}