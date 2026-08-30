import { expect, test, describe } from 'vitest';
import { prioritizationResultSchema } from '../lib/ai/prioritize-schema';

describe('prioritizationResultSchema', () => {
  test('accepts valid Apply recommendation', () => {
    const valid = {
      recommendation: 'Apply',
      reason: 'Good match',
      confirmedMatches: ['React'],
      gapsOrUnknowns: ['AWS'],
      nextActions: ['Apply now']
    };
    expect(() => prioritizationResultSchema.parse(valid)).not.toThrow();
  });

  test('accepts valid Maybe/Skip recommendations', () => {
    const maybe = {
      recommendation: 'Maybe',
      reason: 'Missing some things',
      confirmedMatches: [],
      gapsOrUnknowns: [],
      nextActions: []
    };
    expect(() => prioritizationResultSchema.parse(maybe)).not.toThrow();
    
    const skip = { ...maybe, recommendation: 'Skip' };
    expect(() => prioritizationResultSchema.parse(skip)).not.toThrow();
  });

  test('rejects invalid recommendation', () => {
    const invalid = {
      recommendation: 'Hire',
      reason: 'Good match',
      confirmedMatches: [],
      gapsOrUnknowns: [],
      nextActions: []
    };
    expect(() => prioritizationResultSchema.parse(invalid)).toThrow();
  });

  test('nextActions max 3', () => {
    const invalid = {
      recommendation: 'Apply',
      reason: 'Good match',
      confirmedMatches: [],
      gapsOrUnknowns: [],
      nextActions: ['1', '2', '3', '4']
    };
    expect(() => prioritizationResultSchema.parse(invalid)).toThrow();
  });
});
