import React, { useState } from 'react';

/**
 * ValidationDisplay Component
 * Shows Chain of Responsibility pattern when submitting reports
 *
 * Backend chain: Location → Profanity → Duplicate → Spam
 *
 * ✅ Visual representation of validation chain
 * ✅ Shows which validator passed/failed
 * ✅ Educational display for OOP/DSA project
 */
export const ValidationDisplay = ({ visible = true }) => {
    const [validationSteps, setValidationSteps] = useState([]);
    const [testResult, setTestResult] = useState(null);

    /**
     * Validation chain steps (matches backend)
     */
    const VALIDATION_CHAIN = [
        {
            name: 'LocationValidator',
            description: 'Checks if lat/lng are valid and within HCMC bounds',
            icon: '📍',
            order: 1
        },
        {
            name: 'ProfanityCheckValidator',
            description: 'Filters bad words, excessive caps, suspicious patterns',
            icon: '🚫',
            order: 2
        },
        {
            name: 'DuplicateCheckValidator',
            description: 'Prevents reports within 100m in last 30 minutes',
            icon: '🔄',
            order: 3
        },
        {
            name: 'SpamCheckValidator',
            description: 'Max 3 reports per 5 min, 10 per hour per IP',
            icon: '⚠️',
            order: 4
        }
    ];

    /**
     * Simulate validation chain with test data
     */
    const testValidation = (testCase) => {
        setTestResult(null);
        setValidationSteps([]);

        // Simulate async validation
        const runValidation = async () => {
            let steps = [];
            let passed = true;

            for (let i = 0; i < VALIDATION_CHAIN.length; i++) {
                const validator = VALIDATION_CHAIN[i];

                // Simulate validation delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Determine pass/fail based on test case
                let stepPassed = true;
                let message = '';

                switch (validator.name) {
                    case 'LocationValidator':
                        stepPassed = testCase !== 'invalid_location';
                        message = stepPassed
                            ? '✅ Location is valid and within bounds'
                            : '❌ Location is invalid or outside HCMC';
                        break;

                    case 'ProfanityCheckValidator':
                        stepPassed = testCase !== 'profanity';
                        message = stepPassed
                            ? '✅ Content is clean'
                            : '❌ Profanity or suspicious content detected';
                        break;

                    case 'DuplicateCheckValidator':
                        stepPassed = testCase !== 'duplicate';
                        message = stepPassed
                            ? '✅ No duplicate reports nearby'
                            : '❌ Similar report exists within 100m';
                        break;

                    case 'SpamCheckValidator':
                        stepPassed = testCase !== 'spam';
                        message = stepPassed
                            ? '✅ Spam check passed'
                            : '❌ Too many reports from this IP';
                        break;
                }

                steps.push({
                    ...validator,
                    passed: stepPassed,
                    message
                });

                setValidationSteps([...steps]);

                // If validation fails, stop chain
                if (!stepPassed) {
                    passed = false;
                    break;
                }
            }

            setTestResult({
                passed,
                failedAt: passed ? null : steps.findIndex(s => !s.passed)
            });
        };

        runValidation();
    };

    if (!visible) return null;

    return (
        <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '350px',
            maxWidth: '400px',
            zIndex: 1000
        }}>
            <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
            }}>
                🔗 Validation Chain
            </h3>

            <p style={{
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '15px',
                lineHeight: '1.5'
            }}>
                Chain of Responsibility pattern: Each validator checks report, passes to next if valid.
            </p>

            {/* Test Buttons */}
            <div style={{ marginBottom: '15px' }}>
                <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                }}>
                    Test Scenarios:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    <button
                        onClick={() => testValidation('valid')}
                        style={{
                            padding: '8px',
                            background: '#10B981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}
                    >
                        ✅ Valid Report
                    </button>
                    <button
                        onClick={() => testValidation('invalid_location')}
                        style={{
                            padding: '8px',
                            background: '#EF4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}
                    >
                        📍 Bad Location
                    </button>
                    <button
                        onClick={() => testValidation('profanity')}
                        style={{
                            padding: '8px',
                            background: '#F59E0B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}
                    >
                        🚫 Profanity
                    </button>
                    <button
                        onClick={() => testValidation('duplicate')}
                        style={{
                            padding: '8px',
                            background: '#8B5CF6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}
                    >
                        🔄 Duplicate
                    </button>
                    <button
                        onClick={() => testValidation('spam')}
                        style={{
                            padding: '8px',
                            background: '#EC4899',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600'
                        }}
                    >
                        ⚠️ Spam
                    </button>
                </div>
            </div>

            {/* Validation Steps */}
            {validationSteps.length > 0 && (
                <div style={{
                    background: '#F9FAFB',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px'
                }}>
                    {validationSteps.map((step, index) => (
                        <div key={index}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                marginBottom: '10px'
                            }}>
                                {/* Icon */}
                                <div style={{
                                    fontSize: '20px',
                                    flexShrink: 0
                                }}>
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        color: '#111827',
                                        marginBottom: '4px'
                                    }}>
                                        {step.order}. {step.name}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        color: '#6B7280',
                                        marginBottom: '6px'
                                    }}>
                                        {step.description}
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        background: step.passed ? '#ECFDF5' : '#FEE2E2',
                                        color: step.passed ? '#065F46' : '#991B1B',
                                        borderRadius: '4px',
                                        fontWeight: '600'
                                    }}>
                                        {step.message}
                                    </div>
                                </div>

                                {/* Status */}
                                <div style={{
                                    fontSize: '18px',
                                    flexShrink: 0
                                }}>
                                    {step.passed ? '✅' : '❌'}
                                </div>
                            </div>

                            {/* Arrow to next */}
                            {index < validationSteps.length - 1 && (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#D1D5DB',
                                    fontSize: '16px',
                                    margin: '8px 0'
                                }}>
                                    ↓
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Final Result */}
            {testResult && (
                <div style={{
                    padding: '12px',
                    background: testResult.passed ? '#ECFDF5' : '#FEE2E2',
                    borderRadius: '8px',
                    border: `2px solid ${testResult.passed ? '#10B981' : '#EF4444'}`
                }}>
                    <div style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: testResult.passed ? '#065F46' : '#991B1B',
                        marginBottom: '6px'
                    }}>
                        {testResult.passed ? '✅ All Validators Passed' : '❌ Validation Failed'}
                    </div>
                    <div style={{
                        fontSize: '11px',
                        color: testResult.passed ? '#065F46' : '#991B1B'
                    }}>
                        {testResult.passed
                            ? 'Report successfully validated and can be submitted'
                            : `Stopped at step ${testResult.failedAt + 1}: ${validationSteps[testResult.failedAt]?.name}`
                        }
                    </div>
                </div>
            )}

            {/* Backend Info */}
            <div style={{
                marginTop: '15px',
                padding: '10px',
                background: '#F3F4F6',
                borderRadius: '6px',
                fontSize: '10px',
                color: '#6B7280',
                lineHeight: '1.5'
            }}>
                <strong>Backend Implementation:</strong><br/>
                • ValidationChain builds: Location → Profanity → Duplicate → Spam<br/>
                • Each validator extends ReportValidator (abstract class)<br/>
                • If any validator fails, chain stops immediately
            </div>
        </div>
    );
};

export default ValidationDisplay;