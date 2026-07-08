const password = 'secret_sauce';

const users = {
  standard: {
    username: 'standard_user',
    password,
    description: 'Primary user for stable end-to-end journeys'
  },
  lockedOut: {
    username: 'locked_out_user',
    password,
    expectedError: 'Epic sadface: Sorry, this user has been locked out.',
    description: 'Negative authentication scenario'
  },
  problem: {
    username: 'problem_user',
    password,
    description: 'User with known UI/data inconsistencies'
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password,
    description: 'User with intentionally slower login behaviour'
  },
  error: {
    username: 'error_user',
    password,
    description: 'User with known error-prone behaviours'
  },
  visual: {
    username: 'visual_user',
    password,
    description: 'User suited to visual smoke validation'
  }
};

module.exports = { users };
