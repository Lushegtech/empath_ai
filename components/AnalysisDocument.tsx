import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, Rect } from '@react-pdf/renderer';
import { AnalysisResult } from '../types';

// Register a serif font if available, otherwise fallback to Times-Roman
// For a robust solution we'd register a Google Font, but using standard fonts ensures stability without network
Font.register({
    family: 'CormorantGaramond',
    src: 'https://fonts.gstatic.com/s/cormorantgaramond/v16/co3Bm8cnal1Yr7nJmnYuT8I6KDw.ttf', // Regular
});

// Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#F1ECE2', // Cream background
        padding: 40,
        fontFamily: 'Helvetica', // Fallback for body
        color: '#10302A',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(16, 48, 42, 0.1)',
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'column',
    },
    brandName: {
        fontSize: 10,
        fontFamily: 'Helvetica',
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: 'rgba(16, 48, 42, 0.4)',
        marginBottom: 4,
    },
    reportTitle: {
        fontSize: 24,
        fontFamily: 'Times-Roman', // Using standard serif to mock Garamond look if font fails
        color: '#10302A',
    },
    typeBadge: {
        backgroundColor: '#10302A',
        padding: '6 12',
        borderRadius: 2,
    },
    typeText: {
        color: '#F1ECE2',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Times-Roman',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(16, 48, 42, 0.1)',
        paddingBottom: 8,
    },
    traitCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        padding: 15,
        borderRadius: 4,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    traitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    traitName: {
        fontSize: 14,
        fontFamily: 'Times-Roman',
        textTransform: 'uppercase',
    },
    traitScore: {
        fontSize: 10,
        color: 'rgba(16, 48, 42, 0.6)',
    },
    progressBarBg: {
        height: 3,
        backgroundColor: 'rgba(16, 48, 42, 0.05)',
        borderRadius: 1.5,
        marginBottom: 10,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#9C5B42',
        borderRadius: 1.5,
    },
    description: {
        fontSize: 10,
        lineHeight: 1.6,
        color: 'rgba(16, 48, 42, 0.8)',
        marginBottom: 10,
    },
    listContainer: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 10,
    },
    listColumn: {
        flex: 1,
    },
    listTitle: {
        fontSize: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: 'rgba(16, 48, 42, 0.5)',
        marginBottom: 6,
    },
    listItem: {
        fontSize: 9,
        marginBottom: 4,
        color: 'rgba(16, 48, 42, 0.7)',
        flexDirection: 'row',
    },
    bullet: {
        width: 3,
        height: 3,
        backgroundColor: '#9C5B42',
        borderRadius: 1.5,
        marginRight: 6,
        marginTop: 4,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: 'rgba(16, 48, 42, 0.1)',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 8,
        color: 'rgba(16, 48, 42, 0.4)',
    },
});

interface AnalysisDocumentProps {
    result: AnalysisResult;
}

const AnalysisDocument: React.FC<AnalysisDocumentProps> = ({ result }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.brandName}>Empath AI</Text>
                    <Text style={styles.reportTitle}>Analysis Report</Text>
                </View>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{result.personalityType}</Text>
                </View>
            </View>

            {/* Intro */}
            <View style={styles.section}>
                <Text style={[styles.description, { fontSize: 12, marginBottom: 20 }]}>
                    {result.shortDescription}
                </Text>
            </View>

            {/* Traits Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trait Breakdown</Text>
                {result.detailedBreakdown.map((trait, index) => (
                    <View key={index} style={styles.traitCard}>
                        <View style={styles.traitHeader}>
                            <Text style={styles.traitName}>{trait.name}</Text>
                            <Text style={styles.traitScore}>{trait.score}% - {trait.level}</Text>
                        </View>

                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${trait.score}%` }]} />
                        </View>

                        <Text style={styles.description}>{trait.description}</Text>

                        <View style={styles.listContainer}>
                            {/* Implications */}
                            <View style={styles.listColumn}>
                                <Text style={styles.listTitle}>Implications</Text>
                                {trait.meanings.map((m, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <View style={styles.bullet} />
                                        <Text style={{ flex: 1 }}>{m}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Advice */}
                            <View style={styles.listColumn}>
                                <Text style={styles.listTitle}>Advice</Text>
                                {trait.actionableAdvice.map((a, i) => (
                                    <View key={i} style={styles.listItem}>
                                        <View style={[styles.bullet, { backgroundColor: '#10302A', opacity: 0.4 }]} />
                                        <Text style={{ flex: 1 }}>{a}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Footer */}
            <View style={styles.footer} fixed>
                <Text style={styles.footerText}>Generated by Empath AI</Text>
                <Text style={styles.footerText} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} />
            </View>
        </Page>
    </Document>
);

export default AnalysisDocument;
